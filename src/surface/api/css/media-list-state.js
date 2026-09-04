import { MediaList } from "./media-list-constructor.js";

const state = new WeakMap();

export function createMediaList(text = "") {
  const list = Object.create(MediaList.prototype);
  state.set(list, { values: parseMediaText(text), indexedLength: 0 });
  refreshMediaList(list);
  return list;
}

export function requireMediaList(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

export function setMediaText(list, text) {
  requireMediaList(list).values = parseMediaText(text);
  refreshMediaList(list);
}

export function refreshMediaList(list) {
  const record = requireMediaList(list);
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
}

function parseMediaText(text) {
  const values = [];
  for (const part of `${text}`.split(",")) {
    const value = part.trim();
    if (value !== "" && !values.includes(value)) values.push(value);
  }
  return values;
}
