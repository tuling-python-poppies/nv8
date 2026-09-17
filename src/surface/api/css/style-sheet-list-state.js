import { StyleSheetList } from "./style-sheet-list-constructor.js";

const state = new WeakMap();

export function createStyleSheetList(source = []) {
  const list = Object.create(StyleSheetList.prototype);
  state.set(list, {
    source: typeof source === "function" ? source : () => source,
    indexedLength: 0,
  });
  refreshStyleSheetList(list);
  return list;
}

function requireStyleSheetList(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function refreshStyleSheetList(list) {
  const record = requireStyleSheetList(list);
  const values = record.source();
  for (let index = values.length; index < record.indexedLength; index += 1) delete list[index];
  for (let index = 0; index < values.length; index += 1) {
    Object.defineProperty(list, index, {
      value: values[index],
      writable: false,
      enumerable: true,
      configurable: true,
    });
  }
  record.indexedLength = values.length;
  return values;
}
