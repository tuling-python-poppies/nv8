import { textContentValue } from "./node-getters.js";
import { removeNode, requireNode } from "./node-state.js";

export function scriptTextValue(element) {
  requireNode(element);
  return textContentValue(element);
}

export function setScriptTextValue(element, value, nullAsEmpty = false) {
  const state = requireNode(element);
  const text = nullAsEmpty && value === null ? "" : `${value}`;
  for (const child of state.children.slice()) {
    removeNode(element, child);
  }
  if (text !== "") {
    element.appendChild(state.ownerDocument.createTextNode(text));
  }
}
