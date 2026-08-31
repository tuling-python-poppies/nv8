import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

export function AbstractRange() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(AbstractRange, "AbstractRange");

export function installAbstractRangeConstructor() {
  delete AbstractRange.prototype.constructor;
  defineGlobalConstructor("AbstractRange", AbstractRange);
}

export function finishAbstractRangeConstructor() {
  defineConstructorBacklink(AbstractRange.prototype, AbstractRange);
  defineToStringTag(AbstractRange.prototype, "AbstractRange");
}
