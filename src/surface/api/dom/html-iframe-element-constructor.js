import {
  defineGlobalConstructor,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  HTMLElement,
  registerHTMLElementFactory,
} from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";

export function HTMLIFrameElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLIFrameElement, "HTMLIFrameElement");

function createHTMLIFrameElement(tagName, ownerDocument) {
  const element = Object.create(HTMLIFrameElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLIFrameElementFactory() {
  Object.setPrototypeOf(HTMLIFrameElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLIFrameElement, HTMLElement);
  delete HTMLIFrameElement.prototype.constructor;
  defineGlobalConstructor("HTMLIFrameElement", HTMLIFrameElement);
  registerHTMLElementFactory("iframe", createHTMLIFrameElement);
}
