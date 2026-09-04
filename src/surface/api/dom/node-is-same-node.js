import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../../engine/webidl/cross-realm-method.js";
import { isSameNodeAlgorithm } from "./node-algorithms.js";
import { Node } from "./node-constructor.js";

export const isSameNode = {
  isSameNode(other) {
    const foreignMethod = findCrossRealmPrototypeMethod(
      this,
      "isSameNode",
      isSameNode,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, this, arguments);
    }
    const result = isSameNodeAlgorithm(this, other);
    traceCall("window.Node.prototype.isSameNode", "Node", [other], result);
    return result;
  },
}.isSameNode;
registerNativeFunction(isSameNode, "isSameNode");
export function installNodeIsSameNode() {
  definePrototypeMethod(Node.prototype, "isSameNode", isSameNode);
}
