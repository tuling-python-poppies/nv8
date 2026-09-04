import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Range } from "./range-constructor.js";
import { setRangeStart } from "./range-state.js";

export const setStart = {
  setStart(node, offset) {
    setRangeStart(this, node, offset);
    traceCall("window.Range.prototype.setStart", "Range", [node, offset], undefined);
  },
}.setStart;
registerNativeFunction(setStart, "setStart");
export function installRangeSetStart() {
  definePrototypeMethod(Range.prototype, "setStart", setStart);
}
