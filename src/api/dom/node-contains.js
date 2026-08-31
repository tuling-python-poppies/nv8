import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { containsAlgorithm } from "./node-algorithms.js";
import { Node } from "./node-constructor.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../webidl/cross-realm-method.js";

export const contains = {
  contains(other) {
    const foreignMethod = findCrossRealmPrototypeMethod(
      this,
      "contains",
      contains,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, this, arguments);
    }
    const result = containsAlgorithm(this, other);
    traceCall("window.Node.prototype.contains", "Node", [other], result);
    return result;
  },
}.contains;
registerNativeFunction(contains, "contains");
export function installNodeContains() {
  definePrototypeMethod(Node.prototype, "contains", contains);
}
