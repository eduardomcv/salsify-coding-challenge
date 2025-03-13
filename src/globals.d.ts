import { Datastore } from "./datastoreTypes";

// I'm extending the Window type to include our datastore's types
declare global {
  interface Window {
    datastore: Datastore;
  }
}
