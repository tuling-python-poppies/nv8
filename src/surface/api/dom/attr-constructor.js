import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Node } from "./node-constructor.js";

export function Attr() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(Attr, "Attr");

export function installAttrConstructor() {
  Object.setPrototypeOf(Attr.prototype, Node.prototype);
  Object.setPrototypeOf(Attr, Node);
  delete Attr.prototype.constructor;
  defineGlobalConstructor("Attr", Attr);
}

export function finishAttrConstructor() {
  defineConstructorBacklink(Attr.prototype, Attr);
  defineToStringTag(Attr.prototype, "Attr");
}
