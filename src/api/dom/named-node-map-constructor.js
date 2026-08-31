import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

export function NamedNodeMap() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(NamedNodeMap, "NamedNodeMap");

export function installNamedNodeMapConstructor() {
  delete NamedNodeMap.prototype.constructor;
  defineGlobalConstructor("NamedNodeMap", NamedNodeMap);
}

export function finishNamedNodeMapConstructor() {
  defineConstructorBacklink(NamedNodeMap.prototype, NamedNodeMap);
  defineToStringTag(NamedNodeMap.prototype, "NamedNodeMap");
}
