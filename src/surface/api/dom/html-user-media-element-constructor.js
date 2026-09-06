import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";
import { initializeUserMediaElement } from "./html-user-media-element-state.js";

export function HTMLUserMediaElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLUserMediaElement, "HTMLUserMediaElement");

function createHTMLUserMediaElement(tagName, ownerDocument) {
  const element = Object.create(HTMLUserMediaElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  initializeUserMediaElement(element);
  return element;
}

export function installHTMLUserMediaElementConstructor() {
  Object.setPrototypeOf(HTMLUserMediaElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLUserMediaElement, HTMLElement);
  delete HTMLUserMediaElement.prototype.constructor;
  defineGlobalConstructor("HTMLUserMediaElement", HTMLUserMediaElement);
  registerHTMLElementFactory("usermedia", createHTMLUserMediaElement);
}
