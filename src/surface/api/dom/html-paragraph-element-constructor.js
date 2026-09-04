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

export function HTMLParagraphElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLParagraphElement, "HTMLParagraphElement");

export function createHTMLParagraphElement(tagName, ownerDocument) {
  const element = Object.create(HTMLParagraphElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLParagraphElementConstructor() {
  Object.setPrototypeOf(
    HTMLParagraphElement.prototype,
    HTMLElement.prototype,
  );
  Object.setPrototypeOf(HTMLParagraphElement, HTMLElement);
  delete HTMLParagraphElement.prototype.constructor;
  defineGlobalConstructor("HTMLParagraphElement", HTMLParagraphElement);
  registerHTMLElementFactory("p", createHTMLParagraphElement);
}

export function finishHTMLParagraphElementConstructor() {
  defineConstructorBacklink(
    HTMLParagraphElement.prototype,
    HTMLParagraphElement,
  );
  defineToStringTag(HTMLParagraphElement.prototype, "HTMLParagraphElement");
}
