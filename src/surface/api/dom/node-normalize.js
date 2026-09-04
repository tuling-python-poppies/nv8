import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../../engine/webidl/cross-realm-method.js";
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
