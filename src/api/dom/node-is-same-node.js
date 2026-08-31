import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../webidl/cross-realm-method.js";
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
