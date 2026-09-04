import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../../engine/webidl/cross-realm-method.js";
import { cloneNodeAlgorithm } from "./node-algorithms.js";
import { Node } from "./node-constructor.js";

export const cloneNode = {
  cloneNode() {
    const foreignMethod = findCrossRealmPrototypeMethod(
      this,
      "cloneNode",
      cloneNode,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, this, arguments);
    }
    const deep = Boolean(arguments[0]);
    const result = cloneNodeAlgorithm(this, deep);
    traceCall("window.Node.prototype.cloneNode", "Node", [deep], result);
    return result;
  },
}.cloneNode;
registerNativeFunction(cloneNode, "cloneNode");
export function installNodeCloneNode() {
  definePrototypeMethod(Node.prototype, "cloneNode", cloneNode);
}
