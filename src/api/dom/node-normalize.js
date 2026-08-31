import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../webidl/cross-realm-method.js";
import { normalizeAlgorithm } from "./node-algorithms.js";
import { Node } from "./node-constructor.js";

export const normalize = {
  normalize() {
    const foreignMethod = findCrossRealmPrototypeMethod(
      this,
      "normalize",
      normalize,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, this, arguments);
    }
    normalizeAlgorithm(this);
    traceCall("window.Node.prototype.normalize", "Node", [], undefined);
  },
}.normalize;
registerNativeFunction(normalize, "normalize");
export function installNodeNormalize() {
  definePrototypeMethod(Node.prototype, "normalize", normalize);
}
