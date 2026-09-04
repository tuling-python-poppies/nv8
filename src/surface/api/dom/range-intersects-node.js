import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { rangeIntersectsNode } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

export const intersectsNode = {
  intersectsNode(node) {
    const result = rangeIntersectsNode(this, node);
    traceCall("window.Range.prototype.intersectsNode", "Range", [node], result);
    return result;
  },
}.intersectsNode;
registerNativeFunction(intersectsNode, "intersectsNode");
export function installRangeIntersectsNode() {
  definePrototypeMethod(Range.prototype, "intersectsNode", intersectsNode);
}
