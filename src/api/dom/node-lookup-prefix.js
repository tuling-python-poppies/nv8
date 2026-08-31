import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { lookupPrefixAlgorithm } from "./node-algorithms.js";
import { Node } from "./node-constructor.js";

export const lookupPrefix = {
  lookupPrefix(namespace) {
    const result = lookupPrefixAlgorithm(this, namespace);
    traceCall("window.Node.prototype.lookupPrefix", "Node", [namespace], result);
    return result;
  },
}.lookupPrefix;
registerNativeFunction(lookupPrefix, "lookupPrefix");
export function installNodeLookupPrefix() {
  definePrototypeMethod(Node.prototype, "lookupPrefix", lookupPrefix);
}
