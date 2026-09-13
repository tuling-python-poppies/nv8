import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createHTMLCollection } from "./html-collection-state.js";
import { HTMLAllCollection } from "./html-all-collection-constructor.js";
import {
  descendants,
  ELEMENT_NODE,
  registerMutationHook,
  requireNode,
} from "./node-state.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。live collection 用
// WeakRef 跟踪，避免历史集合同样常驻并参与每次全量刷新。
const allCollectionSlot = createRealmSlot(() => ({
  liveCollections: new Set(),
}), "allCollection");

function allCollectionState() {
  return allCollectionSlot.get(globalThis);
}

const collectionState = new WeakMap();
const collectionFinalization = new FinalizationRegistry((ref) => {
  allCollectionState().liveCollections.delete(ref);
});

export function createHTMLAllCollection(document) {
  const collection = (...arguments_) => callCollection(collection, arguments_);
  delete collection.name;
  delete collection.length;
  Object.setPrototypeOf(collection, HTMLAllCollection.prototype);
  registerNativeFunction(collection, "all");
  collectionState.set(collection, {
    document,
    indexedLength: 0,
    namedProperties: new Set(),
  });
  const ref = new WeakRef(collection);
  allCollectionState().liveCollections.add(ref);
  collectionFinalization.register(collection, ref);
  refreshHTMLAllCollection(collection);
  return collection;
}

/**
 * 当前仍被跟踪的 live HTMLAllCollection 数量（测试用）。
 */
export function liveHTMLAllCollectionCount() {
  const refs = allCollectionState().liveCollections;
  for (const ref of refs) {
    if (ref.deref() === undefined) refs.delete(ref);
  }
  return refs.size;
}

export function requireHTMLAllCollection(value) {
  const state = collectionState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function htmlAllItems(collection) {
  const state = requireHTMLAllCollection(collection);
  return descendants(state.document).filter(
    node => requireNode(node).nodeType === ELEMENT_NODE,
  );
}

export function htmlAllItem(collection, value) {
  const items = htmlAllItems(collection);
  if (typeof value === "string") {
    if (!/^(?:0|[1-9][0-9]*)$/u.test(value)) {
      return htmlAllNamedItem(collection, value);
    }
    return items[Number(value)] ?? null;
  }
  if (value === undefined) {
    return null;
  }
  const number = Number(value);
  const index = Number.isFinite(number) ? Math.trunc(number) >>> 0 : 0;
  return items[index] ?? null;
}

export function htmlAllNamedItem(collection, name) {
  const normalized = `${name}`;
  if (normalized === "") {
    return null;
  }
  const matches = matchingItems(collection, normalized);
  if (matches.length === 0) {
    return null;
  }
  if (matches.length === 1) {
    return matches[0];
  }
  return createHTMLCollection(() => matchingItems(collection, normalized));
}

export function refreshHTMLAllCollection(collection) {
  const state = requireHTMLAllCollection(collection);
  const items = htmlAllItems(collection);
  for (let index = items.length; index < state.indexedLength; index += 1) {
    delete collection[index];
  }
  for (const name of state.namedProperties) {
    delete collection[name];
  }
  state.namedProperties.clear();
  for (let index = 0; index < items.length; index += 1) {
    Object.defineProperty(collection, index, {
      value: items[index],
      writable: false,
      enumerable: true,
      configurable: true,
    });
  }
  for (const element of items) {
    for (const name of [
      element.getAttribute("id"),
      element.getAttribute("name"),
    ]) {
      if (
        !name
        || state.namedProperties.has(name)
        || Reflect.has(HTMLAllCollection.prototype, name)
      ) {
        continue;
      }
      Object.defineProperty(collection, name, {
        value: htmlAllNamedItem(collection, name),
        writable: false,
        enumerable: false,
        configurable: true,
      });
      state.namedProperties.add(name);
    }
  }
  state.indexedLength = items.length;
}

registerMutationHook(() => {
  const refs = allCollectionState().liveCollections;
  for (const ref of refs) {
    const collection = ref.deref();
    if (collection === undefined) {
      refs.delete(ref);
    } else {
      refreshHTMLAllCollection(collection);
    }
  }
});

function matchingItems(collection, name) {
  return htmlAllItems(collection).filter(
    element => element.getAttribute("id") === name
      || element.getAttribute("name") === name,
  );
}

function callCollection(collection, arguments_) {
  return htmlAllItem(collection, arguments_[0]);
}
