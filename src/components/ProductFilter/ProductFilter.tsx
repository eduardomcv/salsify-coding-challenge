import { ChangeEvent } from "react";

import { OperatorID, PropertyID, PropertyType } from "../../datastoreTypes";

import "./ProductFilter.css";

const PROPERTIES = window.datastore.getProperties();
const OPERATORS = window.datastore.getOperators();

const OPERATOR_TEXT_MAP = OPERATORS.reduce(
  (acc, operator) => {
    acc[operator.id] = operator.text;

    return acc;
  },
  {} as Record<OperatorID, string>,
);

const PROPERTY_TYPE_OPERATOR_MAP: Record<PropertyType, OperatorID[]> = {
  enumerated: ["equals", "any", "none", "in"],
  number: ["equals", "greater_than", "less_than", "any", "none", "in"],
  string: ["equals", "any", "none", "in", "contains"],
};

export interface ProductFilterProps {
  selectedPropertyID: PropertyID | null;
  selectedOperatorID: OperatorID | null;
  inputValue: string | string[] | null;
  onPropertyChange(newPropertyID: PropertyID): void;
  onOperatorChange(newOperatorID: OperatorID): void;
  onInputChange(newInput: string | string[]): void;
}

export function ProductFilter(props: ProductFilterProps) {
  const {
    selectedPropertyID,
    selectedOperatorID,
    inputValue,
    onPropertyChange,
    onOperatorChange,
    onInputChange,
  } = props;

  const selectedProperty = PROPERTIES.find(
    (property) => property.id === selectedPropertyID,
  );

  const availableOperators = selectedProperty
    ? PROPERTY_TYPE_OPERATOR_MAP[selectedProperty.type]
    : [];

  // We only want to show the input when we have both selections.
  const showInput = selectedPropertyID !== null && selectedOperatorID !== null;

  const isEnumeratedProperty = selectedProperty?.type === "enumerated";

  function handlePropertyChange(event: ChangeEvent<HTMLSelectElement>) {
    // The empty selection is disabled, so the selection can only be a property ID.
    const propertyID = Number(event.currentTarget.value);

    onPropertyChange(propertyID);
  }

  function handleOperatorChange(event: ChangeEvent<HTMLSelectElement>) {
    // We know for sure this will be an operator ID because we are using the operator
    // ids as the option values below.
    const operatorID = event.currentTarget.value as OperatorID;

    onOperatorChange(operatorID);
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    onInputChange(event.currentTarget.value);
  }

  return (
    <div className="product-filter">
      <select
        name="properties"
        value={selectedPropertyID ?? undefined}
        onChange={handlePropertyChange}
      >
        <option selected disabled>
          Select a property...
        </option>
        {PROPERTIES.map((property) => (
          <option key={property.id} value={property.id}>
            {property.name}
          </option>
        ))}
      </select>
      <select
        name="operators"
        value={selectedOperatorID ?? undefined}
        onChange={handleOperatorChange}
      >
        <option selected disabled>
          Select an operator...
        </option>
        {availableOperators.map((operator) => (
          <option key={operator} value={operator}>
            {OPERATOR_TEXT_MAP[operator]}
          </option>
        ))}
      </select>
      {showInput && (
        <>
          {isEnumeratedProperty ? (
            <ul className="properties-listbox" role="listbox">
              {selectedProperty.values?.map((value) => {
                const isSelected =
                  Array.isArray(inputValue) &&
                  inputValue.some((val) => val === value);

                function handleItemSelection() {
                  let newValue: string[];

                  if (!Array.isArray(inputValue)) {
                    newValue = [value];
                  } else if (isSelected) {
                    newValue = inputValue.filter((val) => val !== value);
                  } else {
                    newValue = [...inputValue, value];
                  }

                  onInputChange(newValue);
                }

                return (
                  <li
                    role="option"
                    className={isSelected ? "selected" : undefined}
                    onClick={handleItemSelection}
                  >
                    {value}
                  </li>
                );
              })}
            </ul>
          ) : (
            <input
              type="text"
              value={inputValue ?? ""}
              onChange={handleInputChange}
              placeholder="Filter value..."
            />
          )}
        </>
      )}
    </div>
  );
}
