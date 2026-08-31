import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  findCrossRealmPrototypeMethod,
} from "../../webidl/cross-realm-method.js";
import { insertBeforeAlgorithm } from "./node-algorithms.js";
import { Node } from "./node-constructor.js";

export const insertBefore = {
  insertBefore(node, child) {
    const foreignMethod = findCrossRealmPrototypeMethod(
      this,
      "insertBefore",
      insertBefore,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, this, arguments);
    }
    if (arguments.length < 2) {
      throw new TypeError(
        "Failed to execute 'insertBefore' on 'Node': 2 arguments required.",
      );
    }
    const result = insertBeforeAlgorithm(this, node, child);
    traceCall("window.Node.prototype.insertBefore", "Node", [node, child], result);
    return result;
  },
}.insertBefore;
registerNativeFunction(insertBefore, "insertBefore");
export function installNodeInsertBefore() {
  definePrototypeMethod(Node.prototype, "insertBefore", insertBefore);
}
