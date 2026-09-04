import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { rangeToString } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

export const toString = {
  toString() {
    const result = rangeToString(this);
    traceCall("window.Range.prototype.toString", "Range", [], result);
    return result;
  },
}.toString;
registerNativeFunction(toString, "toString");
export function installRangeToString() {
  definePrototypeMethod(Range.prototype, "toString", toString);
}
