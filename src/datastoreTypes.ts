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

export interface Property {
  id: PropertyID;
  name: string;
  type: string;
  values?: string[];
}

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
