import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { setBoundaryAfter } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

const setEndAfter = {
  setEndAfter(node) {
    setBoundaryAfter(this, node, false);
    traceCall("window.Range.prototype.setEndAfter", "Range", [node], undefined);
  },
}.setEndAfter;
registerNativeFunction(setEndAfter, "setEndAfter");
export function installRangeSetEndAfter() {
  definePrototypeMethod(Range.prototype, "setEndAfter", setEndAfter);
}
