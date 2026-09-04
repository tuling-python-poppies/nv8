import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../../engine/webidl/cross-realm-method.js";
import { replaceChildAlgorithm } from "./node-algorithms.js";
import { Node } from "./node-constructor.js";

export const replaceChild = {
  replaceChild(node, child) {
    const foreignMethod = findCrossRealmPrototypeMethod(
      this,
      "replaceChild",
      replaceChild,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, this, arguments);
    }
    const result = replaceChildAlgorithm(this, node, child);
    traceCall("window.Node.prototype.replaceChild", "Node", [node, child], result);
    return result;
  },
}.replaceChild;
registerNativeFunction(replaceChild, "replaceChild");
export function installNodeReplaceChild() {
  definePrototypeMethod(Node.prototype, "replaceChild", replaceChild);
}
