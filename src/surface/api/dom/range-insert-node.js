import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { insertNodeAlgorithm } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

export const insertNode = {
  insertNode(node) {
    insertNodeAlgorithm(this, node);
    traceCall("window.Range.prototype.insertNode", "Range", [node], undefined);
  },
}.insertNode;
registerNativeFunction(insertNode, "insertNode");
export function installRangeInsertNode() {
  definePrototypeMethod(Range.prototype, "insertNode", insertNode);
}
