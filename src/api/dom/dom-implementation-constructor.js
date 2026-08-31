import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

const implementationState = new WeakMap();

export function DOMImplementation() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(DOMImplementation, "DOMImplementation");

export function createDOMImplementation(document) {
  const implementation = Object.create(DOMImplementation.prototype);
  implementationState.set(implementation, { document });
  return implementation;
}

export function requireDOMImplementation(value) {
  const state = implementationState.get(value);
  if (state === undefined) {
    throw new TypeError("Illegal invocation");
  }
  return state;
}

export function installDOMImplementationConstructor() {
  delete DOMImplementation.prototype.constructor;
  defineGlobalConstructor("DOMImplementation", DOMImplementation);
}

export function finishDOMImplementationConstructor() {
  defineConstructorBacklink(
    DOMImplementation.prototype,
    DOMImplementation,
  );
  defineToStringTag(DOMImplementation.prototype, "DOMImplementation");
}
