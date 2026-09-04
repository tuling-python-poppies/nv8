import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function NodeIterator() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(NodeIterator, "NodeIterator");

export function installNodeIteratorConstructor() {
  delete NodeIterator.prototype.constructor;
  defineGlobalConstructor("NodeIterator", NodeIterator);
}

export function finishNodeIteratorConstructor() {
  defineConstructorBacklink(NodeIterator.prototype, NodeIterator);
  defineToStringTag(NodeIterator.prototype, "NodeIterator");
}
