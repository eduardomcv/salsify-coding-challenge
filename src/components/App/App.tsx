import { useState } from "react";

import { PropertyID, OperatorID } from "../../datastoreTypes";
import { ProductsFilter } from "../ProductsFilter";
import { ProductsTable } from "../ProductsTable";

import "./App.css";

export function App() {
  const [selectedPropertyID, setSelectedPropertyID] =
    useState<PropertyID | null>(null);
  const [selectedOperatorID, setSelectedOperatorID] =
    useState<OperatorID | null>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [enumeratedSelections, setEnumeratedSelections] = useState<string[]>(
    [],
  );

  function handlePropertyChange(newPropertyID: PropertyID) {
    setSelectedPropertyID(newPropertyID);
    // reset inputs when changing properties
    setInputValue("");
    setEnumeratedSelections([]);
  }

  function handleOperatorChange(newOperatorID: OperatorID) {
    setSelectedOperatorID(newOperatorID);
  }

  function handleInputChange(newInput: string) {
    setInputValue(newInput);
  }

  function handleEnumSelection(newSelections: string[]) {
    setEnumeratedSelections(newSelections);
  }

  function handleClear() {
    setSelectedPropertyID(null);
    setSelectedOperatorID(null);
    setInputValue("");
    setEnumeratedSelections([]);
  }

  return (
    <div className="app-container">
      <ProductsFilter
        selectedPropertyID={selectedPropertyID}
        selectedOperatorID={selectedOperatorID}
        inputValue={inputValue}
        enumeratedSelections={enumeratedSelections}
        onPropertyChange={handlePropertyChange}
        onOperatorChange={handleOperatorChange}
        onInputChange={handleInputChange}
        onEnumSelection={handleEnumSelection}
        onClear={handleClear}
      />
      <ProductsTable
        selectedPropertyID={selectedPropertyID}
        selectedOperatorID={selectedOperatorID}
        inputValue={inputValue}
        enumeratedSelections={enumeratedSelections}
      />
    </div>
  );
}
