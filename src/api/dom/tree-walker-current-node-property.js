import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  requireTreeWalker,
  setTreeWalkerCurrentNode,
} from "./tree-walker-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get currentNode() {
    const result = requireTreeWalker(this).currentNode;
    traceGetter(
      "window.TreeWalker.prototype.currentNode",
      "TreeWalker",
      result,
    );
    return result;
  },
  set currentNode(value) {
    setTreeWalkerCurrentNode(this, value);
  },
}, "currentNode");

export const currentNode = descriptor.get;
export const setCurrentNode = descriptor.set;
registerNativeFunction(currentNode, "get currentNode");
registerNativeFunction(setCurrentNode, "set currentNode");
