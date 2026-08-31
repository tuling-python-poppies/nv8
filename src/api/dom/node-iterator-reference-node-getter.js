import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireNodeIterator } from "./node-iterator-state.js";

export const referenceNode = Object.getOwnPropertyDescriptor({
  get referenceNode() {
    const result = requireNodeIterator(this).referenceNode;
    traceGetter(
      "window.NodeIterator.prototype.referenceNode",
      "NodeIterator",
      result,
    );
    return result;
  },
}, "referenceNode").get;
registerNativeFunction(referenceNode, "get referenceNode");
