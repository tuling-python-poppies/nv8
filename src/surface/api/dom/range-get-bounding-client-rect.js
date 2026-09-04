import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Range } from "./range-constructor.js";
import { requireRange } from "./range-state.js";

export const getBoundingClientRect = {
  getBoundingClientRect() {
    requireRange(this);
    const result = Object.freeze({
      x: 0, y: 0, width: 0, height: 0,
      top: 0, right: 0, bottom: 0, left: 0,
      toJSON() {
        return {
          x: 0, y: 0, width: 0, height: 0,
          top: 0, right: 0, bottom: 0, left: 0,
        };
      },
    });
    traceCall("window.Range.prototype.getBoundingClientRect", "Range", [], result);
    return result;
  },
}.getBoundingClientRect;
registerNativeFunction(getBoundingClientRect, "getBoundingClientRect");
export function installRangeGetBoundingClientRect() {
  definePrototypeMethod(
    Range.prototype,
    "getBoundingClientRect",
    getBoundingClientRect,
  );
}
