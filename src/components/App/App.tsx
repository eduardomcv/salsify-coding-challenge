import { useState } from "react";

import { PropertyID, OperatorID } from "../../datastoreTypes";
import { ProductFilter } from "../ProductFilter";
import { ProductsTable } from "../ProductsTable";

import "./App.css";

export function App() {
  const [selectedPropertyID, setSelectedPropertyID] =
    useState<PropertyID | null>(null);
  const [selectedOperatorID, setSelectedOperatorID] =
    useState<OperatorID | null>(null);
  const [inputValue, setInputValue] = useState<string | string[]>("");

  function handlePropertyChange(newPropertyID: PropertyID) {
    setSelectedPropertyID(newPropertyID);
    // clear input when changing properties
    setInputValue("");
  }

  function handleOperatorChange(newOperatorID: OperatorID) {
    setSelectedOperatorID(newOperatorID);
  }

  function handleInputChange(newInput: string | string[]) {
    setInputValue(newInput);
  }

  return (
    <div className="container">
      <ProductFilter
        selectedPropertyID={selectedPropertyID}
        selectedOperatorID={selectedOperatorID}
        inputValue={inputValue}
        onPropertyChange={handlePropertyChange}
        onOperatorChange={handleOperatorChange}
        onInputChange={handleInputChange}
      />
      <ProductsTable
        selectedPropertyID={selectedPropertyID}
        selectedOperatorID={selectedOperatorID}
        inputValue={inputValue}
      />
    </div>
  );
}
