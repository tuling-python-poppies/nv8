import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../../engine/webidl/cross-realm-method.js";
import { compareDocumentPositionAlgorithm } from "./node-algorithms.js";
import { Node } from "./node-constructor.js";

export const compareDocumentPosition = {
  compareDocumentPosition(other) {
    const foreignMethod = findCrossRealmPrototypeMethod(
      this,
      "compareDocumentPosition",
      compareDocumentPosition,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, this, arguments);
    }
    const result = compareDocumentPositionAlgorithm(this, other);
    traceCall("window.Node.prototype.compareDocumentPosition", "Node", [other], result);
    return result;
  },
}.compareDocumentPosition;
registerNativeFunction(compareDocumentPosition, "compareDocumentPosition");
export function installNodeCompareDocumentPosition() {
  definePrototypeMethod(
    Node.prototype,
    "compareDocumentPosition",
    compareDocumentPosition,
  );
}
