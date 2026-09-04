import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../../engine/webidl/cross-realm-method.js";
import { getRootNodeAlgorithm } from "./node-algorithms.js";
import { Node } from "./node-constructor.js";

export const getRootNode = {
  getRootNode() {
    const foreignMethod = findCrossRealmPrototypeMethod(
      this,
      "getRootNode",
      getRootNode,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, this, arguments);
    }
    const options = arguments[0];
    const result = getRootNodeAlgorithm(this, options);
    traceCall("window.Node.prototype.getRootNode", "Node", [options], result);
    return result;
  },
}.getRootNode;
registerNativeFunction(getRootNode, "getRootNode");
export function installNodeGetRootNode() {
  definePrototypeMethod(Node.prototype, "getRootNode", getRootNode);
}
