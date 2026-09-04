import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLSlotElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLSlotElement, "HTMLSlotElement");

export function createHTMLSlotElement(tagName, ownerDocument) {
  const element = Object.create(HTMLSlotElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLSlotElementConstructor() {
  Object.setPrototypeOf(HTMLSlotElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLSlotElement, HTMLElement);
  delete HTMLSlotElement.prototype.constructor;
  defineGlobalConstructor("HTMLSlotElement", HTMLSlotElement);
  registerHTMLElementFactory("slot", createHTMLSlotElement);
}

export function finishHTMLSlotElementConstructor() {
  defineConstructorBacklink(HTMLSlotElement.prototype, HTMLSlotElement);
  defineToStringTag(HTMLSlotElement.prototype, "HTMLSlotElement");
}
