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

export function HTMLHeadingElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLHeadingElement, "HTMLHeadingElement");

function createHTMLHeadingElement(tagName, ownerDocument) {
  const element = Object.create(HTMLHeadingElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function installHTMLHeadingElementConstructor() {
  Object.setPrototypeOf(
    HTMLHeadingElement.prototype,
    HTMLElement.prototype,
  );
  Object.setPrototypeOf(HTMLHeadingElement, HTMLElement);
  delete HTMLHeadingElement.prototype.constructor;
  defineGlobalConstructor("HTMLHeadingElement", HTMLHeadingElement);
  registerHTMLElementFactory("h1", createHTMLHeadingElement);
  registerHTMLElementFactory("h2", createHTMLHeadingElement);
  registerHTMLElementFactory("h3", createHTMLHeadingElement);
  registerHTMLElementFactory("h4", createHTMLHeadingElement);
  registerHTMLElementFactory("h5", createHTMLHeadingElement);
  registerHTMLElementFactory("h6", createHTMLHeadingElement);
}

export function finishHTMLHeadingElementConstructor() {
  defineConstructorBacklink(
    HTMLHeadingElement.prototype,
    HTMLHeadingElement,
  );
  defineToStringTag(HTMLHeadingElement.prototype, "HTMLHeadingElement");
}
