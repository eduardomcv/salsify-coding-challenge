import { OperatorID, Product, PropertyID } from "../../datastoreTypes";

import "./ProductsTable.css";

const PRODUCTS = window.datastore.getProducts();
const PROPERTIES = window.datastore.getProperties();

const PROPERTY_ID_NAME_MAP = PROPERTIES.reduce(
  (acc, property) => {
    acc[property.id] = property.name;
    return acc;
  },
  {} as Record<PropertyID, string>,
);

// The separator used when splitting the keywords to search
const SEPARATOR = ", ";

// In this case, the property ids are numbers, but they could be anything else.
const PROPERTY_ID_ORDER: PropertyID[] = [0, 1, 2, 3, 4];

interface ProductFilters {
  propertyID: PropertyID;
  operatorID: OperatorID;
  inputValue: string;
  enumeratedSelections: string[];
}

function filterProducts(
  products: Product[],
  filters: ProductFilters,
): Product[] {
  const { propertyID, operatorID, inputValue, enumeratedSelections } = filters;

  return products.filter((product) => {
    const propertyToFilter = product.property_values.find(
      (property) => property.property_id === propertyID,
    );

    switch (operatorID) {
      case "equals": {
        if (propertyToFilter?.value === undefined) {
          return false;
        }

        if (inputValue.length > 0) {
          return String(propertyToFilter.value) === inputValue;
        }

        // My assumption is that, for enumerable properties, the "equals" operator requires all selected
        // values to match the property's values exactly. Otherwise, it would function the same as the "Is any of" operator.
        // However, our datastore doesn't seem to support multiple property values for now.
        // Still, I added the possibility to read comma separated keywords in property values.
        if (enumeratedSelections.length > 0) {
          const values = String(propertyToFilter.value).split(SEPARATOR);

          return enumeratedSelections.every((selection) =>
            values.includes(selection),
          );
        }

        return false;
      }
      case "greater_than": {
        const propertyValue = Number(propertyToFilter?.value);
        const convertedInputValue = Number(inputValue);

        if (Number.isNaN(propertyValue) || Number.isNaN(convertedInputValue)) {
          return false;
        }

        return propertyValue > convertedInputValue;
      }
      case "less_than": {
        const propertyValue = Number(propertyToFilter?.value);
        const convertedInputValue = Number(inputValue);

        if (Number.isNaN(propertyValue) || Number.isNaN(convertedInputValue)) {
          return false;
        }

        return propertyValue < convertedInputValue;
      }
      case "any": {
        return propertyToFilter?.value !== undefined;
      }
      case "none": {
        return propertyToFilter?.value === undefined;
      }
      case "in": {
        if (propertyToFilter?.value === undefined) {
          return false;
        }

        let values: string[] = [];

        if (inputValue.length > 0) {
          values = inputValue.split(SEPARATOR);
        }

        if (enumeratedSelections.length > 0) {
          values = enumeratedSelections;
        }

        return values.some((val) => val === String(propertyToFilter.value));
      }
      case "contains": {
        if (propertyToFilter?.value === undefined) {
          return false;
        }

        return String(propertyToFilter.value)
          .toLowerCase()
          .includes(inputValue.toLowerCase());
      }
    }
  });
}

export interface ProductsTableProps {
  selectedPropertyID: PropertyID | null;
  selectedOperatorID: OperatorID | null;
  inputValue: string;
  enumeratedSelections: string[];
}

export function ProductsTable(props: ProductsTableProps) {
  const {
    selectedPropertyID,
    selectedOperatorID,
    inputValue,
    enumeratedSelections,
  } = props;

  const shouldFilter =
    selectedOperatorID !== null && selectedPropertyID !== null;

  const productsList = shouldFilter
    ? filterProducts(PRODUCTS, {
        inputValue,
        enumeratedSelections,
        operatorID: selectedOperatorID,
        propertyID: selectedPropertyID,
      })
    : PRODUCTS;

  return (
    <table className="products-table">
      <thead>
        <tr>
          {PROPERTY_ID_ORDER.map((id) => (
            <th key={id} scope="col">
              {PROPERTY_ID_NAME_MAP[id]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {productsList.map((product) => {
          const sortedProperties = PROPERTY_ID_ORDER.map((id) =>
            product.property_values.find((value) => value.property_id === id),
          );

          return (
            <tr key={product.id}>
              {sortedProperties.map((property, index) => {
                if (!property) {
                  return <td key={`empty-${index}`} />;
                }

                return <td key={property.property_id}>{property.value}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
