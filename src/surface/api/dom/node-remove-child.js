import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../../engine/webidl/cross-realm-method.js";
import { removeChildAlgorithm } from "./node-algorithms.js";
import { Node } from "./node-constructor.js";

export const removeChild = {
  removeChild(child) {
    const foreignMethod = findCrossRealmPrototypeMethod(
      this,
      "removeChild",
      removeChild,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, this, arguments);
    }
    const result = removeChildAlgorithm(this, child);
    traceCall("window.Node.prototype.removeChild", "Node", [child], result);
    return result;
  },
}.removeChild;
registerNativeFunction(removeChild, "removeChild");
export function installNodeRemoveChild() {
  definePrototypeMethod(Node.prototype, "removeChild", removeChild);
}
