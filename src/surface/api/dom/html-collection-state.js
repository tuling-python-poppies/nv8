import { registerMutationHook } from "./node-state.js";
import { HTMLCollection } from "./html-collection-constructor.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const htmlCollectionSlot = createRealmSlot(() => ({
  liveCollections: new Set(),
}), "collection");

function htmlCollectionRealmState() {
  return htmlCollectionSlot.get(globalThis);
}

const collectionState = new WeakMap();

registerMutationHook(() => {
  for (const collection of htmlCollectionRealmState().liveCollections) {
    refreshHTMLCollection(collection);
  }
});

export function createHTMLCollection(source) {
  const collection = Object.create(HTMLCollection.prototype);
  collectionState.set(collection, {
    source,
    indexedLength: 0,
    namedProperties: new Set(),
  });
  htmlCollectionRealmState().liveCollections.add(collection);
  refreshHTMLCollection(collection);
  return collection;
}

export function requireHTMLCollection(value) {
  const state = collectionState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function refreshHTMLCollection(collection) {
  const state = requireHTMLCollection(collection);
  const values = state.source();
  for (let index = 0; index < state.indexedLength; index += 1) {
    if (index >= values.length) {
      delete collection[index];
    }
  }
  for (const name of state.namedProperties) {
    delete collection[name];
  }
  state.namedProperties.clear();
  for (let index = 0; index < values.length; index += 1) {
    const element = values[index];
    Object.defineProperty(collection, index, {
      value: element,
      writable: false,
      enumerable: true,
      configurable: true,
    });
    const names = [];
    if (typeof element.getAttribute === "function") {
      const id = element.getAttribute("id");
      const name = element.getAttribute("name");
      if (id) {
        names.push(id);
      }
      if (name && name !== id) {
        names.push(name);
      }
    }
    for (const name of names) {
      if (
        !Reflect.has(HTMLCollection.prototype, name)
        && !Object.prototype.hasOwnProperty.call(collection, name)
      ) {
        Object.defineProperty(collection, name, {
          value: element,
          writable: false,
          enumerable: false,
          configurable: true,
        });
        state.namedProperties.add(name);
      }
    }
  }
  state.indexedLength = values.length;
  return values;
}
