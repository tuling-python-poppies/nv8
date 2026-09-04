import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { HTMLElement, registerHTMLElementFactory } from "./html-element-constructor.js";
import { HTML_NAMESPACE, initializeElement } from "./element-state.js";
import { initializeMarquee } from "./html-marquee-element-state.js";
export function HTMLMarqueeElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLMarqueeElement, "HTMLMarqueeElement");
function createHTMLMarqueeElement(tagName, ownerDocument) {
  const element = Object.create(HTMLMarqueeElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  initializeMarquee(element);
  return element;
}
export function installHTMLMarqueeElementConstructor() {
  Object.setPrototypeOf(HTMLMarqueeElement.prototype, HTMLElement.prototype);
  Object.setPrototypeOf(HTMLMarqueeElement, HTMLElement);
  delete HTMLMarqueeElement.prototype.constructor;
  defineGlobalConstructor("HTMLMarqueeElement", HTMLMarqueeElement);
  registerHTMLElementFactory("marquee", createHTMLMarqueeElement);
}
