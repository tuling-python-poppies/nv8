import { NodeList } from "./node-list-constructor.js";

const nodeListState = new WeakMap();

export function createNodeList(source, live = false) {
  const list = Object.create(NodeList.prototype);
  nodeListState.set(list, {
    source,
    live,
    snapshot: live ? null : source().slice(),
    indexedLength: 0,
  });
  refreshNodeList(list);
  return list;
}

export function requireNodeList(value) {
  const state = nodeListState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function nodeListValues(value) {
  const state = requireNodeList(value);
  return state.live ? state.source().slice() : state.snapshot.slice();
}

export function refreshNodeList(value) {
  const state = requireNodeList(value);
  const values = state.live ? state.source() : state.snapshot;
  for (let index = 0; index < state.indexedLength; index += 1) {
    if (index >= values.length) {
      delete value[index];
    }
  }
  for (let index = 0; index < values.length; index += 1) {
    Object.defineProperty(value, index, {
      value: values[index],
      writable: false,
      enumerable: true,
      configurable: true,
    });
  }
  state.indexedLength = values.length;
  return values;
}
