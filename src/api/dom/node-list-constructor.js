import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

export function NodeList() {
  throw new TypeError("Illegal constructor");
}

registerNativeFunction(NodeList, "NodeList");

export function installNodeListConstructor() {
  delete NodeList.prototype.constructor;
  defineGlobalConstructor("NodeList", NodeList);
}

export function installNodeListConstructorBacklink() {
  defineConstructorBacklink(NodeList.prototype, NodeList);
}

export function installNodeListToStringTag() {
  defineToStringTag(NodeList.prototype, "NodeList");
}
