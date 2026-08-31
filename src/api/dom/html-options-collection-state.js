import { createHTMLCollection } from "./html-collection-state.js";
import { descendants } from "./node-state.js";
import { HTMLOptionsCollection } from "./html-options-collection-constructor.js";

const optionsCollectionState = new WeakMap();

export function createHTMLOptionsCollection(select) {
  const collection = createHTMLCollection(
    () => selectOptions(select),
  );
  Object.setPrototypeOf(collection, HTMLOptionsCollection.prototype);
  optionsCollectionState.set(collection, { select });
  return collection;
}

export function requireHTMLOptionsCollection(collection) {
  const state = optionsCollectionState.get(collection);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function selectOptions(select) {
  return descendants(select).filter(node => node.localName === "option");
}
