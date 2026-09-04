import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
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
