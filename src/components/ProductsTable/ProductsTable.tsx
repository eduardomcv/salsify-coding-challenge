import { OperatorID, PropertyID } from "../../datastoreTypes";

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

// In this case, the property ids are numbers, but they could be anything else.
const PROPERTY_ID_ORDER: PropertyID[] = [0, 1, 2, 3, 4];

export interface ProductsTableProps {
  selectedPropertyID: PropertyID | null;
  selectedOperatorID: OperatorID | null;
  inputValue: string | string[];
}

export function ProductsTable(props: ProductsTableProps) {
  const { selectedPropertyID, selectedOperatorID, inputValue } = props;

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
        {PRODUCTS.map((product) => {
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
