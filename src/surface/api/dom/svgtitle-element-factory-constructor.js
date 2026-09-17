import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGTitleElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGTitleElement, "SVGTitleElement");

function createSVGTitleElement(localName, ownerDocument) {
  const element = Object.create(SVGTitleElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGTitleElementFactory() {
  Object.setPrototypeOf(SVGTitleElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGTitleElement, SVGElement);
  delete SVGTitleElement.prototype.constructor;
  defineGlobalConstructor("SVGTitleElement", SVGTitleElement);
  defineConstructorBacklink(SVGTitleElement.prototype, SVGTitleElement);
  defineToStringTag(SVGTitleElement.prototype, "SVGTitleElement");
  registerSVGElementFactory("title", createSVGTitleElement);
}
