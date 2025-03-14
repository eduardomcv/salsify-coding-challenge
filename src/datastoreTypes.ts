/**
 * These types are a representation of the provided datastore.js file.
 */

export type PropertyID = number;
export type ProductID = number;

export type OperatorID =
  | "equals"
  | "greater_than"
  | "less_than"
  | "any"
  | "none"
  | "in"
  | "contains";

export type PropertyType = "string" | "number" | "enumerated";

export interface StringProperty {
  id: PropertyID;
  name: string;
  type: "string";
}

export interface NumberProperty {
  id: PropertyID;
  name: string;
  type: "number";
}

// For now, only enumerated properties have possible "values"
export interface EnumeratedProperty {
  id: PropertyID;
  name: string;
  type: "enumerated";
  values: string[];
}

export type Property = StringProperty | NumberProperty | EnumeratedProperty;

export interface PropertyValue {
  property_id: PropertyID;
  value: string | number;
}

export interface Product {
  id: ProductID;
  property_values: PropertyValue[];
}

export interface Operator {
  id: OperatorID;
  text: string;
}

export interface Datastore {
  getProducts(): Product[];
  getProperties(): Property[];
  getOperators(): Operator[];
  products: Product[];
  properties: Property[];
  operators: Operator[];
}
