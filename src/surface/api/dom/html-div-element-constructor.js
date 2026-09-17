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

export function HTMLDivElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLDivElement, "HTMLDivElement");

function createHTMLDivElement(tagName, ownerDocument) {
  const element = Object.create(HTMLDivElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLDivElementConstructor() {
  Object.setPrototypeOf(HTMLDivElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLDivElement, HTMLElement);
  delete HTMLDivElement.prototype.constructor;
  defineGlobalConstructor("HTMLDivElement", HTMLDivElement);
  registerHTMLElementFactory("div", createHTMLDivElement);
}

export function finishHTMLDivElementConstructor() {
  defineConstructorBacklink(HTMLDivElement.prototype, HTMLDivElement);
  defineToStringTag(HTMLDivElement.prototype, "HTMLDivElement");
}
