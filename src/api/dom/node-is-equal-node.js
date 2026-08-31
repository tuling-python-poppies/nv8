import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../webidl/cross-realm-method.js";
import { isEqualNodeAlgorithm } from "./node-algorithms.js";
import { Node } from "./node-constructor.js";

export const isEqualNode = {
  isEqualNode(other) {
    const foreignMethod = findCrossRealmPrototypeMethod(
      this,
      "isEqualNode",
      isEqualNode,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, this, arguments);
    }
    const result = isEqualNodeAlgorithm(this, other);
    traceCall("window.Node.prototype.isEqualNode", "Node", [other], result);
    return result;
  },
}.isEqualNode;
registerNativeFunction(isEqualNode, "isEqualNode");
export function installNodeIsEqualNode() {
  definePrototypeMethod(Node.prototype, "isEqualNode", isEqualNode);
}
