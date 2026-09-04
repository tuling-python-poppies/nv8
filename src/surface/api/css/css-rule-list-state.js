import { CSSRuleList } from "./css-rule-list-constructor.js";

const state = new WeakMap();

export function createCSSRuleList(values = []) {
  const list = Object.create(CSSRuleList.prototype);
  state.set(list, { values, indexedLength: 0 });
  refreshCSSRuleList(list);
  return list;
}

export function requireCSSRuleList(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function refreshCSSRuleList(list) {
  const record = requireCSSRuleList(list);
  for (let index = record.values.length; index < record.indexedLength; index += 1) {
    delete list[index];
  }
  for (let index = 0; index < record.values.length; index += 1) {
    Object.defineProperty(list, index, {
      value: record.values[index],
      writable: false,
      enumerable: true,
      configurable: true,
    });
  }
  record.indexedLength = record.values.length;
  return record.values;
}
