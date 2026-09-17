import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../../engine/webidl/cross-realm-method.js";
import { isEqualNodeAlgorithm } from "./node-algorithms.js";
import { Node } from "./node-constructor.js";

const isEqualNode = {
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
