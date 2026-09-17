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

export function HTMLSpanElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLSpanElement, "HTMLSpanElement");

function createHTMLSpanElement(tagName, ownerDocument) {
  const element = Object.create(HTMLSpanElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLSpanElementConstructor() {
  Object.setPrototypeOf(HTMLSpanElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLSpanElement, HTMLElement);
  delete HTMLSpanElement.prototype.constructor;
  defineGlobalConstructor("HTMLSpanElement", HTMLSpanElement);
  registerHTMLElementFactory("span", createHTMLSpanElement);
}

export function finishHTMLSpanElementConstructor() {
  defineConstructorBacklink(HTMLSpanElement.prototype, HTMLSpanElement);
  defineToStringTag(HTMLSpanElement.prototype, "HTMLSpanElement");
}
