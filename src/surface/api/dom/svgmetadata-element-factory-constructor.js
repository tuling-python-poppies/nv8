import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGElement } from "./svg-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGMetadataElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGMetadataElement, "SVGMetadataElement");

export function createSVGMetadataElement(localName, ownerDocument) {
  const element = Object.create(SVGMetadataElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGMetadataElementFactory() {
  Object.setPrototypeOf(SVGMetadataElement.prototype, SVGElement.prototype);
  Object.setPrototypeOf(SVGMetadataElement, SVGElement);
  delete SVGMetadataElement.prototype.constructor;
  defineGlobalConstructor("SVGMetadataElement", SVGMetadataElement);
  defineConstructorBacklink(SVGMetadataElement.prototype, SVGMetadataElement);
  defineToStringTag(SVGMetadataElement.prototype, "SVGMetadataElement");
  registerSVGElementFactory("metadata", createSVGMetadataElement);
}
