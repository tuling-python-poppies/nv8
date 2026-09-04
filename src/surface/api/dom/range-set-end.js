import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Range } from "./range-constructor.js";
import { setRangeEnd } from "./range-state.js";

export const setEnd = {
  setEnd(node, offset) {
    setRangeEnd(this, node, offset);
    traceCall("window.Range.prototype.setEnd", "Range", [node, offset], undefined);
  },
}.setEnd;
registerNativeFunction(setEnd, "setEnd");
export function installRangeSetEnd() {
  definePrototypeMethod(Range.prototype, "setEnd", setEnd);
}
