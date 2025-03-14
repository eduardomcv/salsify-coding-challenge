import { useState } from "react";
import { PropertyID, OperatorID } from "../../datastoreTypes";
import { ProductFilter } from "../ProductFilter";

import "./App.css";

const products = window.datastore.getProducts();

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
      <table>
        <thead>
          <tr>
            <th scope="col">Product Name</th>
            <th scope="col">Color</th>
            <th scope="col">Weight (oz)</th>
            <th scope="col">Category</th>
            <th scope="col">Wireless</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr>
              <td>{product.property_values[0].value}</td>
              <td>{product.property_values[1].value}</td>
              <td>{product.property_values[2].value}</td>
              <td>{product.property_values[3].value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
