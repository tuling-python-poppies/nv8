import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGScriptElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGScriptElement, "SVGScriptElement");

function createSVGScriptElement(localName, ownerDocument) {
  const element = Object.create(SVGScriptElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGScriptElementFactory() {
  Object.setPrototypeOf(SVGScriptElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGScriptElement, SVGElement);
  delete SVGScriptElement.prototype.constructor;
  defineGlobalConstructor("SVGScriptElement", SVGScriptElement);
  defineConstructorBacklink(SVGScriptElement.prototype, SVGScriptElement);
  defineToStringTag(SVGScriptElement.prototype, "SVGScriptElement");
  registerSVGElementFactory("script", createSVGScriptElement);
}
