import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { expandAlgorithm } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

export const expand = {
  expand() {
    const unit = arguments[0];
    expandAlgorithm(this, unit);
    traceCall("window.Range.prototype.expand", "Range", [unit], undefined);
  },
}.expand;
registerNativeFunction(expand, "expand");
export function installRangeExpand() {
  definePrototypeMethod(Range.prototype, "expand", expand);
}
