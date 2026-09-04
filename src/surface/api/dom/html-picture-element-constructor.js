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

export function HTMLPictureElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLPictureElement, "HTMLPictureElement");

function createHTMLPictureElement(tagName, ownerDocument) {
  const element = Object.create(HTMLPictureElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLPictureElement() {
  Object.setPrototypeOf(HTMLPictureElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLPictureElement, HTMLElement);
  delete HTMLPictureElement.prototype.constructor;
  defineGlobalConstructor("HTMLPictureElement", HTMLPictureElement);
  registerHTMLElementFactory("picture", createHTMLPictureElement);
  defineConstructorBacklink(HTMLPictureElement.prototype, HTMLPictureElement);
  defineToStringTag(HTMLPictureElement.prototype, "HTMLPictureElement");
}
