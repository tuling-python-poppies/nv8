import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Range } from "./range-constructor.js";
import { requireRange } from "./range-state.js";

export const detach = {
  detach() {
    requireRange(this);
    traceCall("window.Range.prototype.detach", "Range", [], undefined);
  },
}.detach;
registerNativeFunction(detach, "detach");
export function installRangeDetach() {
  definePrototypeMethod(Range.prototype, "detach", detach);
}
