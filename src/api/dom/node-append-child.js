import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../webidl/cross-realm-method.js";
import { appendChildAlgorithm } from "./node-algorithms.js";
import { Node } from "./node-constructor.js";

export const appendChild = {
  appendChild(node) {
    const foreignMethod = findCrossRealmPrototypeMethod(
      this,
      "appendChild",
      appendChild,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, this, arguments);
    }
    const result = appendChildAlgorithm(this, node);
    traceCall("window.Node.prototype.appendChild", "Node", [node], result);
    return result;
  },
}.appendChild;
registerNativeFunction(appendChild, "appendChild");
export function installNodeAppendChild() {
  definePrototypeMethod(Node.prototype, "appendChild", appendChild);
}
