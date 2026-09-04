import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function CSSStyleDeclaration() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(CSSStyleDeclaration, "CSSStyleDeclaration");

export function installCSSStyleDeclarationConstructor() {
  delete CSSStyleDeclaration.prototype.constructor;
  defineGlobalConstructor("CSSStyleDeclaration", CSSStyleDeclaration);
}
