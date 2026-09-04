import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Range } from "./range-constructor.js";
import { requireRange } from "./range-state.js";

export const getClientRects = {
  getClientRects() {
    requireRange(this);
    const result = [];
    traceCall("window.Range.prototype.getClientRects", "Range", [], result);
    return result;
  },
}.getClientRects;
registerNativeFunction(getClientRects, "getClientRects");
export function installRangeGetClientRects() {
  definePrototypeMethod(Range.prototype, "getClientRects", getClientRects);
}
