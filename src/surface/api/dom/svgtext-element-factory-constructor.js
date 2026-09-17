import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGTextPositioningElement } from "./svgtext-positioning-element-factory-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGTextElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGTextElement, "SVGTextElement");

function createSVGTextElement(localName, ownerDocument) {
  const element = Object.create(SVGTextElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGTextElementFactory() {
  Object.setPrototypeOf(SVGTextElement.prototype, SVGTextPositioningElement.prototype);
  Object.setPrototypeOf(SVGTextElement, SVGTextPositioningElement);
  delete SVGTextElement.prototype.constructor;
  defineGlobalConstructor("SVGTextElement", SVGTextElement);
  defineConstructorBacklink(SVGTextElement.prototype, SVGTextElement);
  defineToStringTag(SVGTextElement.prototype, "SVGTextElement");
  registerSVGElementFactory("text", createSVGTextElement);
}
