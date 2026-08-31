import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { NodeList } from "./node-list-constructor.js";

export function RadioNodeList() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(RadioNodeList, "RadioNodeList");

export function installRadioNodeListConstructor() {
  Object.setPrototypeOf(RadioNodeList.prototype, NodeList.prototype);
  Object.setPrototypeOf(RadioNodeList, NodeList);
  delete RadioNodeList.prototype.constructor;
  defineGlobalConstructor("RadioNodeList", RadioNodeList);
}
