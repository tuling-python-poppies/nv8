import {
  createCSSStyleSheet,
  replaceCSSStyleSheetRules,
} from "../css/css-style-sheet-state.js";
import { requireElement } from "./element-state.js";

const state = new WeakMap();

export function styleElementSheet(element) {
  requireElement(element);
  const text = element.textContent ?? "";
  let record = state.get(element);
  if (record === undefined) {
    const sheet = createCSSStyleSheet({
      ownerNode: element,
      media: element.media ?? "",
      disabled: element.disabled,
      title: element.getAttribute("title"),
      text,
    });
    record = { sheet, text };
    state.set(element, record);
  } else if (record.text !== text) {
    replaceCSSStyleSheetRules(record.sheet, text);
    record.text = text;
  }
  record.sheet.media.mediaText = element.media ?? "";
  record.sheet.disabled = element.disabled;
  return record.sheet;
}
