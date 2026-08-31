import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { HTMLElement, registerHTMLElementFactory } from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";
import { initializeFrameSetElement } from "./html-frame-set-element-state.js";

export function HTMLFrameSetElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLFrameSetElement, "HTMLFrameSetElement");

function createHTMLFrameSetElement(tagName, ownerDocument) {
  const element = Object.create(HTMLFrameSetElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  initializeFrameSetElement(element);
  return element;
}

export function installHTMLFrameSetElementConstructor() {
  Object.setPrototypeOf(HTMLFrameSetElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLFrameSetElement, HTMLElement);
  delete HTMLFrameSetElement.prototype.constructor;
  defineGlobalConstructor("HTMLFrameSetElement", HTMLFrameSetElement);
  registerHTMLElementFactory("frameset", createHTMLFrameSetElement);
}
