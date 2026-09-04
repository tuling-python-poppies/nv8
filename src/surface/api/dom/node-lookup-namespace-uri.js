import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { lookupNamespaceURIAlgorithm } from "./node-algorithms.js";
import { Node } from "./node-constructor.js";

export const lookupNamespaceURI = {
  lookupNamespaceURI(prefix) {
    const result = lookupNamespaceURIAlgorithm(this, prefix);
    traceCall("window.Node.prototype.lookupNamespaceURI", "Node", [prefix], result);
    return result;
  },
}.lookupNamespaceURI;
registerNativeFunction(lookupNamespaceURI, "lookupNamespaceURI");
export function installNodeLookupNamespaceURI() {
  definePrototypeMethod(Node.prototype, "lookupNamespaceURI", lookupNamespaceURI);
}
