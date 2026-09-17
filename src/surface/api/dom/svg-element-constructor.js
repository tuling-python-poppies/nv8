import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { initializeElement, parseQualifiedName, SVG_NAMESPACE } from "./element-state.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

// 迁移前这些是模块级状态，会跨宿主图 Realm 共享。
const svgFactorySlot = createRealmSlot(() => ({
  svgFactories: new Map(),
}), "svgFactory");

function svgFactoryState() {
  return svgFactorySlot.get(globalThis);
}

export function SVGElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(SVGElement, "SVGElement");

export function createSVGElement(qualifiedName, ownerDocument) {
  const localName = parseQualifiedName(qualifiedName).localName;
  const factory = svgFactoryState().svgFactories.get(localName);
  if (factory !== undefined) {
    return factory(qualifiedName, ownerDocument);
  }
  const element = Object.create(SVGElement.prototype);
  initializeElement(element, qualifiedName, ownerDocument, SVG_NAMESPACE);
  return element;
}

export function registerSVGElementFactory(localName, factory) {
  svgFactoryState().svgFactories.set(localName, factory);
}

export function installSVGElementConstructor() {
  Object.setPrototypeOf(SVGElement.prototype, Element.prototype);
  Object.setPrototypeOf(SVGElement, Element);
  delete SVGElement.prototype.constructor;
  defineGlobalConstructor("SVGElement", SVGElement);
}
