import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { DocumentFragment } from "./document-fragment-constructor.js";

export function ShadowRoot() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(ShadowRoot, "ShadowRoot");

export function installShadowRootConstructor() {
  Object.setPrototypeOf(ShadowRoot.prototype, DocumentFragment.prototype);
  Object.setPrototypeOf(ShadowRoot, DocumentFragment);
  delete ShadowRoot.prototype.constructor;
  defineGlobalConstructor("ShadowRoot", ShadowRoot);
}

export function finishShadowRootConstructor() {
  defineConstructorBacklink(ShadowRoot.prototype, ShadowRoot);
  defineToStringTag(ShadowRoot.prototype, "ShadowRoot");
}
