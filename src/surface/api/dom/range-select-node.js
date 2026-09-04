import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { selectNodeAlgorithm } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

export const selectNode = {
  selectNode(node) {
    selectNodeAlgorithm(this, node);
    traceCall("window.Range.prototype.selectNode", "Range", [node], undefined);
  },
}.selectNode;
registerNativeFunction(selectNode, "selectNode");
export function installRangeSelectNode() {
  definePrototypeMethod(Range.prototype, "selectNode", selectNode);
}
