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

export function HTMLImageElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLImageElement, "HTMLImageElement");

export function createHTMLImageElement(tagName, ownerDocument) {
  const element = Object.create(HTMLImageElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLImageElementConstructor() {
  Object.setPrototypeOf(
    HTMLImageElement.prototype,
    HTMLElement.prototype,
  );
  Object.setPrototypeOf(HTMLImageElement, HTMLElement);
  delete HTMLImageElement.prototype.constructor;
  defineGlobalConstructor("HTMLImageElement", HTMLImageElement);
  registerHTMLElementFactory("img", createHTMLImageElement);
}

export function finishHTMLImageElementConstructor() {
  defineConstructorBacklink(
    HTMLImageElement.prototype,
    HTMLImageElement,
  );
  defineToStringTag(HTMLImageElement.prototype, "HTMLImageElement");
}
