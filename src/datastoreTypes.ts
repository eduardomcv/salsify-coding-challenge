export interface Property {
  id: number;
  name: string;
  type: string;
  values?: string[];
}

export interface PropertyValue {
  property_id: number;
  value: string;
}

export interface Product {
  id: number;
  property_values: PropertyValue[];
}

export type OperatorID =
  | "equals"
  | "greater_than"
  | "less_than"
  | "any"
  | "none"
  | "in"
  | "contains";

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
