import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { surroundContentsAlgorithm } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

export const surroundContents = {
  surroundContents(newParent) {
    surroundContentsAlgorithm(this, newParent);
    traceCall(
      "window.Range.prototype.surroundContents",
      "Range",
      [newParent],
      undefined,
    );
  },
}.surroundContents;
registerNativeFunction(surroundContents, "surroundContents");
export function installRangeSurroundContents() {
  definePrototypeMethod(Range.prototype, "surroundContents", surroundContents);
}
