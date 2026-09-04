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

export function HTMLSelectedContentElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLSelectedContentElement, "HTMLSelectedContentElement");

function createHTMLSelectedContentElement(tagName, ownerDocument) {
  const element = Object.create(HTMLSelectedContentElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLSelectedContentElement() {
  Object.setPrototypeOf(
    HTMLSelectedContentElement.prototype,
    HTMLElement.prototype,
  );
  Object.setPrototypeOf(HTMLSelectedContentElement, HTMLElement);
  delete HTMLSelectedContentElement.prototype.constructor;
  defineGlobalConstructor(
    "HTMLSelectedContentElement",
    HTMLSelectedContentElement,
  );
  registerHTMLElementFactory(
    "selectedcontent",
    createHTMLSelectedContentElement,
  );
  defineConstructorBacklink(
    HTMLSelectedContentElement.prototype,
    HTMLSelectedContentElement,
  );
  defineToStringTag(
    HTMLSelectedContentElement.prototype,
    "HTMLSelectedContentElement",
  );
}
