import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

export function DOMTokenList() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(DOMTokenList, "DOMTokenList");

export function installDOMTokenListConstructor() {
  delete DOMTokenList.prototype.constructor;
  defineGlobalConstructor("DOMTokenList", DOMTokenList);
}

export function finishDOMTokenListConstructor() {
  defineConstructorBacklink(DOMTokenList.prototype, DOMTokenList);
  defineToStringTag(DOMTokenList.prototype, "DOMTokenList");
}
