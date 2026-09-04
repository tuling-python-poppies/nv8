import { createCSSStyleSheet } from "../css/css-style-sheet-state.js";
import { requireElement } from "./element-state.js";

const state = new WeakMap();

export function linkElementSheet(element) {
  requireElement(element);
  if (!element.relList.contains("stylesheet")) return null;
  let sheet = state.get(element);
  if (sheet === undefined) {
    sheet = createCSSStyleSheet({
      href: element.href,
      ownerNode: element,
      media: element.media,
      disabled: element.disabled,
      title: element.getAttribute("title"),
    });
    state.set(element, sheet);
  }
  sheet.media.mediaText = element.media;
  sheet.disabled = element.disabled;
  return sheet;
}
