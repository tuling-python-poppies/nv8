import {
  getAttributeValue,
  removeAttributeValue,
  setAttributeValue,
} from "./element-state.js";
import { registerMutationHook } from "./node-state.js";
import { DOMTokenList } from "./dom-token-list-constructor.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const tokenListSlot = createRealmSlot(() => ({
  lists: new Set(),
}), "tokenList");

function tokenListState() {
  return tokenListSlot.get(globalThis);
}

const listState = new WeakMap();

registerMutationHook((record) => {
  if (record.type !== "attributes") {
    return;
  }
  for (const list of tokenListState().lists) {
    const state = listState.get(list);
    if (
      state.element === record.target
      && state.attributeName === record.attributeName
    ) {
      refreshDOMTokenList(list);
    }
  }
});

export function createDOMTokenList(element, attributeName) {
  const list = Object.create(DOMTokenList.prototype);
  listState.set(list, {
    element,
    attributeName,
    indexedLength: 0,
  });
  tokenListState().lists.add(list);
  refreshDOMTokenList(list);
  return list;
}

export function requireDOMTokenList(value) {
  const state = listState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function tokensOf(list) {
  const state = requireDOMTokenList(list);
  return (getAttributeValue(state.element, state.attributeName) ?? "")
    .trim()
    .split(/\s+/u)
    .filter(Boolean);
}

export function refreshDOMTokenList(list) {
  const state = requireDOMTokenList(list);
  const tokens = tokensOf(list);
  for (let index = 0; index < state.indexedLength; index += 1) {
    if (index >= tokens.length) {
      delete list[index];
    }
  }
  for (let index = 0; index < tokens.length; index += 1) {
    Object.defineProperty(list, index, {
      value: tokens[index],
      writable: false,
      enumerable: true,
      configurable: true,
    });
  }
  state.indexedLength = tokens.length;
  return tokens;
}

export function setTokens(list, tokens) {
  const state = requireDOMTokenList(list);
  if (tokens.length === 0) {
    removeAttributeValue(state.element, state.attributeName);
  } else {
    setAttributeValue(state.element, state.attributeName, tokens.join(" "));
  }
  refreshDOMTokenList(list);
}

export function validateToken(value) {
  const token = `${value}`;
  if (token === "") {
    throw new DOMException("The token provided must not be empty.", "SyntaxError");
  }
  if (/\s/u.test(token)) {
    throw new DOMException(
      "The token provided contains HTML space characters.",
      "InvalidCharacterError",
    );
  }
  return token;
}
