import { ProductFilter } from "../ProductFilter";

import "./App.css";

const products = window.datastore.getProducts();

export function App() {
  return (
    <div className="container">
      <ProductFilter />
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
