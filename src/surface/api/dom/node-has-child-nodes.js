import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../../engine/webidl/cross-realm-method.js";
import { hasChildNodesAlgorithm } from "./node-algorithms.js";
import { Node } from "./node-constructor.js";

export const hasChildNodes = {
  hasChildNodes() {
    const foreignMethod = findCrossRealmPrototypeMethod(
      this,
      "hasChildNodes",
      hasChildNodes,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, this, arguments);
    }
    const result = hasChildNodesAlgorithm(this);
    traceCall("window.Node.prototype.hasChildNodes", "Node", [], result);
    return result;
  },
}.hasChildNodes;
registerNativeFunction(hasChildNodes, "hasChildNodes");
export function installNodeHasChildNodes() {
  definePrototypeMethod(Node.prototype, "hasChildNodes", hasChildNodes);
}
