import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function TreeWalker() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(TreeWalker, "TreeWalker");
export function installTreeWalkerConstructor() {
  delete TreeWalker.prototype.constructor;
  defineGlobalConstructor("TreeWalker", TreeWalker);
}
export function finishTreeWalkerConstructor() {
  defineConstructorBacklink(TreeWalker.prototype, TreeWalker);
  defineToStringTag(TreeWalker.prototype, "TreeWalker");
}
