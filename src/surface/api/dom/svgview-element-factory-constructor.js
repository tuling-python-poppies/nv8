import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGViewElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGViewElement, "SVGViewElement");

function createSVGViewElement(localName, ownerDocument) {
  const element = Object.create(SVGViewElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGViewElementFactory() {
  Object.setPrototypeOf(SVGViewElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGViewElement, SVGElement);
  delete SVGViewElement.prototype.constructor;
  defineGlobalConstructor("SVGViewElement", SVGViewElement);
  defineConstructorBacklink(SVGViewElement.prototype, SVGViewElement);
  defineToStringTag(SVGViewElement.prototype, "SVGViewElement");
  registerSVGElementFactory("view", createSVGViewElement);
}
