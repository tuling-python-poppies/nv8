import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireNodeIterator } from "./node-iterator-state.js";

export const pointerBeforeReferenceNode = Object.getOwnPropertyDescriptor({
  get pointerBeforeReferenceNode() {
    const result = requireNodeIterator(this).pointerBeforeReferenceNode;
    traceGetter(
      "window.NodeIterator.prototype.pointerBeforeReferenceNode",
      "NodeIterator",
      result,
    );
    return result;
  },
}, "pointerBeforeReferenceNode").get;
registerNativeFunction(
  pointerBeforeReferenceNode,
  "get pointerBeforeReferenceNode",
);
