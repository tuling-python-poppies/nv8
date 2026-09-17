import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLUnknownElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLUnknownElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLUnknownElement, "HTMLUnknownElement");

function createHTMLUnknownElement(tagName, ownerDocument) {
  const element = Object.create(HTMLUnknownElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLUnknownElementConstructor() {
  Object.setPrototypeOf(
    HTMLUnknownElement.prototype,
    HTMLElement.prototype,
  );
  Object.setPrototypeOf(HTMLUnknownElement, HTMLElement);
  delete HTMLUnknownElement.prototype.constructor;
  defineGlobalConstructor("HTMLUnknownElement", HTMLUnknownElement);
  registerHTMLUnknownElementFactory(createHTMLUnknownElement);
}

export function finishHTMLUnknownElementConstructor() {
  defineConstructorBacklink(
    HTMLUnknownElement.prototype,
    HTMLUnknownElement,
  );
  defineToStringTag(HTMLUnknownElement.prototype, "HTMLUnknownElement");
}
