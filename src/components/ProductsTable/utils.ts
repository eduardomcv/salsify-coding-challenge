import { PropertyID, OperatorID, Product } from "../../datastoreTypes";

// The separator used when splitting the keywords to search
const SEPARATOR = ", ";

const PRODUCTS = window.datastore.getProducts();

export interface ProductFilters {
  propertyID: PropertyID | null;
  operatorID: OperatorID | null;
  inputValue: string;
  enumeratedSelections: string[];
}

export function getProducts(filters: ProductFilters) {
  const { propertyID, operatorID, inputValue, enumeratedSelections } = filters;

  if (propertyID === null || operatorID === null) {
    return PRODUCTS;
  }

  if (
    operatorID !== "none" &&
    operatorID !== "any" &&
    !inputValue.length &&
    !enumeratedSelections.length
  ) {
    return PRODUCTS;
  }

  return PRODUCTS.filter((product) => {
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
        // However, the datastore doesn't seem to support multiple property values for now.
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
