import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { initializeElement, MATHML_NAMESPACE } from "./element-state.js";

export function MathMLElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(MathMLElement, "MathMLElement");

export function createMathMLElement(qualifiedName, ownerDocument) {
  const element = Object.create(MathMLElement.prototype);
  initializeElement(
    element,
    qualifiedName,
    ownerDocument,
    MATHML_NAMESPACE,
  );
  return element;
}

export function installMathMLElementConstructor() {
  Object.setPrototypeOf(MathMLElement.prototype, Element.prototype);
  Object.setPrototypeOf(MathMLElement, Element);
  delete MathMLElement.prototype.constructor;
  defineGlobalConstructor("MathMLElement", MathMLElement);
}

export function finishMathMLElementConstructor() {
  defineConstructorBacklink(MathMLElement.prototype, MathMLElement);
  defineToStringTag(MathMLElement.prototype, "MathMLElement");
}
