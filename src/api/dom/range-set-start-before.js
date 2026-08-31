import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { setBoundaryBefore } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

export const setStartBefore = {
  setStartBefore(node) {
    setBoundaryBefore(this, node, true);
    traceCall("window.Range.prototype.setStartBefore", "Range", [node], undefined);
  },
}.setStartBefore;
registerNativeFunction(setStartBefore, "setStartBefore");
export function installRangeSetStartBefore() {
  definePrototypeMethod(Range.prototype, "setStartBefore", setStartBefore);
}
