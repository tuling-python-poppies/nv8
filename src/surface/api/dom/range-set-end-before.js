import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { setBoundaryBefore } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

export const setEndBefore = {
  setEndBefore(node) {
    setBoundaryBefore(this, node, false);
    traceCall("window.Range.prototype.setEndBefore", "Range", [node], undefined);
  },
}.setEndBefore;
registerNativeFunction(setEndBefore, "setEndBefore");
export function installRangeSetEndBefore() {
  definePrototypeMethod(Range.prototype, "setEndBefore", setEndBefore);
}
