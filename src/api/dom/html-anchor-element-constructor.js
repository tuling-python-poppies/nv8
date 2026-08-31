import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLAnchorElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLAnchorElement, "HTMLAnchorElement");

export function createHTMLAnchorElement(tagName, ownerDocument) {
  const element = Object.create(HTMLAnchorElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLAnchorElementConstructor() {
  Object.setPrototypeOf(
    HTMLAnchorElement.prototype,
    HTMLElement.prototype,
  );
  Object.setPrototypeOf(HTMLAnchorElement, HTMLElement);
  delete HTMLAnchorElement.prototype.constructor;
  defineGlobalConstructor("HTMLAnchorElement", HTMLAnchorElement);
  registerHTMLElementFactory("a", createHTMLAnchorElement);
}

export function finishHTMLAnchorElementConstructor() {
  defineConstructorBacklink(
    HTMLAnchorElement.prototype,
    HTMLAnchorElement,
  );
  defineToStringTag(HTMLAnchorElement.prototype, "HTMLAnchorElement");
}
