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

export function HTMLHtmlElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLHtmlElement, "HTMLHtmlElement");

function createHTMLHtmlElement(tagName, ownerDocument) {
  const element = Object.create(HTMLHtmlElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLHtmlElementConstructor() {
  Object.setPrototypeOf(HTMLHtmlElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLHtmlElement, HTMLElement);
  delete HTMLHtmlElement.prototype.constructor;
  defineGlobalConstructor("HTMLHtmlElement", HTMLHtmlElement);
  registerHTMLElementFactory("html", createHTMLHtmlElement);
}

export function finishHTMLHtmlElementConstructor() {
  defineConstructorBacklink(HTMLHtmlElement.prototype, HTMLHtmlElement);
  defineToStringTag(HTMLHtmlElement.prototype, "HTMLHtmlElement");
}
