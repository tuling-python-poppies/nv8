import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { collapseRange } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

export const collapse = {
  collapse() {
    const toStart = Boolean(arguments[0]);
    collapseRange(this, toStart);
    traceCall("window.Range.prototype.collapse", "Range", [toStart], undefined);
  },
}.collapse;
registerNativeFunction(collapse, "collapse");
export function installRangeCollapse() {
  definePrototypeMethod(Range.prototype, "collapse", collapse);
}
