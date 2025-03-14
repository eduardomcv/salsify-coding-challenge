import { ChangeEvent } from "react";

import { OperatorID, PropertyID, PropertyType } from "../../datastoreTypes";

import "./ProductsFilter.css";

const PROPERTIES = window.datastore.getProperties();
const OPERATORS = window.datastore.getOperators();

const OPERATOR_TEXT_MAP = OPERATORS.reduce(
  (acc, operator) => {
    acc[operator.id] = operator.text;

    return acc;
  },
  {} as Record<OperatorID, string>,
);

const ALL_OPERATORS = OPERATORS.map((op) => op.id);

const PROPERTY_TYPE_OPERATOR_MAP: Record<PropertyType, OperatorID[]> = {
  enumerated: ["equals", "any", "none", "in"],
  number: ["equals", "greater_than", "less_than", "any", "none", "in"],
  string: ["equals", "any", "none", "in", "contains"],
};

export interface ProductFilterProps {
  selectedPropertyID: PropertyID | null;
  selectedOperatorID: OperatorID | null;
  inputValue: string;
  enumeratedSelections: string[];
  onPropertyChange(newPropertyID: PropertyID): void;
  onOperatorChange(newOperatorID: OperatorID): void;
  onInputChange(newInput: string): void;
  onEnumSelection(newSelection: string[]): void;
}

export function ProductFilter(props: ProductFilterProps) {
  const {
    selectedPropertyID,
    selectedOperatorID,
    inputValue,
    enumeratedSelections,
    onPropertyChange,
    onOperatorChange,
    onInputChange,
    onEnumSelection,
  } = props;

  const selectedProperty = PROPERTIES.find(
    (property) => property.id === selectedPropertyID,
  );

  const availableOperators = selectedProperty
    ? PROPERTY_TYPE_OPERATOR_MAP[selectedProperty.type]
    : ALL_OPERATORS;

  const isEnumeratedProperty = selectedProperty?.type === "enumerated";

  // We only want to show the input when we have both selections.
  const showInput = selectedPropertyID !== null && selectedOperatorID !== null;

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
        value={selectedPropertyID ?? ""}
        onChange={handlePropertyChange}
      >
        <option value="" disabled>
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
        value={selectedOperatorID ?? ""}
        onChange={handleOperatorChange}
      >
        <option value="" disabled>
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
                const isSelected = enumeratedSelections.some(
                  (selection) => selection === value,
                );

                function handleItemSelection() {
                  let newSelections: string[];

                  if (isSelected) {
                    newSelections = enumeratedSelections.filter(
                      (selection) => selection !== value,
                    );
                  } else {
                    newSelections = [...enumeratedSelections, value];
                  }

                  onEnumSelection(newSelections);
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
