import { createHTMLCollection } from "./html-collection-state.js";
import { HTMLFormControlsCollection } from "./html-form-controls-collection-constructor.js";

const controlsCollectionState = new WeakMap();

export function createHTMLFormControlsCollection(source) {
  const collection = createHTMLCollection(source);
  Object.setPrototypeOf(
    collection,
    HTMLFormControlsCollection.prototype,
  );
  controlsCollectionState.set(collection, { source });
  return collection;
}

export function requireHTMLFormControlsCollection(collection) {
  const state = controlsCollectionState.get(collection);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}
