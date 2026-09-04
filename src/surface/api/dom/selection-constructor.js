import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function Selection() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(Selection, "Selection");

export function installSelectionConstructor() {
  delete Selection.prototype.constructor;
  defineGlobalConstructor("Selection", Selection);
}

export function finishSelectionConstructor() {
  defineConstructorBacklink(Selection.prototype, Selection);
  defineToStringTag(Selection.prototype, "Selection");
}
