import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { HTMLElement, registerHTMLElementFactory } from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";
import { initializeFrameElement } from "./html-frame-element-state.js";

export function HTMLFrameElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLFrameElement, "HTMLFrameElement");

function createHTMLFrameElement(tagName, ownerDocument) {
  const element = Object.create(HTMLFrameElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  initializeFrameElement(element);
  return element;
}

export function installHTMLFrameElementConstructor() {
  Object.setPrototypeOf(HTMLFrameElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLFrameElement, HTMLElement);
  delete HTMLFrameElement.prototype.constructor;
  defineGlobalConstructor("HTMLFrameElement", HTMLFrameElement);
  registerHTMLElementFactory("frame", createHTMLFrameElement);
}
