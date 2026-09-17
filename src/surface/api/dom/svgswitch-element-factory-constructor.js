import { defineConstructorBacklink, defineGlobalConstructor, defineToStringTag } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { SVGGraphicsElement } from "./svg-graphics-element-constructor.js";
import { registerSVGElementFactory } from "./svg-element-constructor.js";
import { initializeElement, SVG_NAMESPACE } from "./element-state.js";

export function SVGSwitchElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGSwitchElement, "SVGSwitchElement");

function createSVGSwitchElement(localName, ownerDocument) {
  const element = Object.create(SVGSwitchElement.prototype);
  initializeElement(element, localName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function installSVGSwitchElementFactory() {
  Object.setPrototypeOf(SVGSwitchElement.prototype, SVGGraphicsElement.prototype);
  Object.setPrototypeOf(SVGSwitchElement, SVGGraphicsElement);
  delete SVGSwitchElement.prototype.constructor;
  defineGlobalConstructor("SVGSwitchElement", SVGSwitchElement);
  defineConstructorBacklink(SVGSwitchElement.prototype, SVGSwitchElement);
  defineToStringTag(SVGSwitchElement.prototype, "SVGSwitchElement");
  registerSVGElementFactory("switch", createSVGSwitchElement);
}
