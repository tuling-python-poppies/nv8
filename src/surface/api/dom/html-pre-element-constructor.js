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

export function HTMLPreElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLPreElement, "HTMLPreElement");

function createHTMLPreElement(tagName, ownerDocument) {
  const element = Object.create(HTMLPreElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLPreElementConstructor() {
  Object.setPrototypeOf(HTMLPreElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLPreElement, HTMLElement);
  delete HTMLPreElement.prototype.constructor;
  defineGlobalConstructor("HTMLPreElement", HTMLPreElement);
  registerHTMLElementFactory("pre", createHTMLPreElement);
  registerHTMLElementFactory("listing", createHTMLPreElement);
  registerHTMLElementFactory("xmp", createHTMLPreElement);
}

export function finishHTMLPreElementConstructor() {
  defineConstructorBacklink(HTMLPreElement.prototype, HTMLPreElement);
  defineToStringTag(HTMLPreElement.prototype, "HTMLPreElement");
}
