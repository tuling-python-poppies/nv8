import { createMediaList } from "./media-list-state.js";
import { StyleSheet } from "./style-sheet-constructor.js";

const state = new WeakMap();

export function createStyleSheet(options = {}) {
  const sheet = Object.create(StyleSheet.prototype);
  initializeStyleSheet(sheet, options);
  return sheet;
}

export function initializeStyleSheet(sheet, options = {}) {
  state.set(sheet, {
    type: "text/css",
    href: options.href ?? null,
    ownerNode: options.ownerNode ?? null,
    parentStyleSheet: options.parentStyleSheet ?? null,
    title: options.title ?? null,
    media: options.media instanceof Object
      && Object.prototype.toString.call(options.media) === "[object MediaList]"
      ? options.media
      : createMediaList(options.media ?? ""),
    disabled: Boolean(options.disabled),
  });
  return sheet;
}

export function requireStyleSheet(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}
