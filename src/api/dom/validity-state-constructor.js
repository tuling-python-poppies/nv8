import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { initializeValidityState } from "./validity-state-state.js";

export function ValidityState() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(ValidityState, "ValidityState");

export function createValidityState(evaluate) {
  const validity = Object.create(ValidityState.prototype);
  initializeValidityState(validity, evaluate);
  return validity;
}

export function installValidityStateConstructor() {
  delete ValidityState.prototype.constructor;
  defineGlobalConstructor("ValidityState", ValidityState);
}
