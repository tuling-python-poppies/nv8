import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

export function History() {
  throw new TypeError("Failed to construct 'History': Illegal constructor");
}

registerNativeFunction(History, "History");

export function installHistoryConstructor() {
  delete History.prototype.constructor;
  defineToStringTag(History.prototype, "History");
  defineGlobalConstructor("History", History);
}

export function installHistoryConstructorBacklink() {
  defineConstructorBacklink(History.prototype, History);
}
