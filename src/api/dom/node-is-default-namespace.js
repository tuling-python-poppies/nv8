import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { isDefaultNamespaceAlgorithm } from "./node-algorithms.js";
import { Node } from "./node-constructor.js";

export const isDefaultNamespace = {
  isDefaultNamespace(namespace) {
    const result = isDefaultNamespaceAlgorithm(this, namespace);
    traceCall("window.Node.prototype.isDefaultNamespace", "Node", [namespace], result);
    return result;
  },
}.isDefaultNamespace;
registerNativeFunction(isDefaultNamespace, "isDefaultNamespace");
export function installNodeIsDefaultNamespace() {
  definePrototypeMethod(Node.prototype, "isDefaultNamespace", isDefaultNamespace);
}
