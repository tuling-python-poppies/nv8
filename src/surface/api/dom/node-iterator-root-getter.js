import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireNodeIterator } from "./node-iterator-state.js";

export const root = Object.getOwnPropertyDescriptor({
  get root() {
    const result = requireNodeIterator(this).root;
    traceGetter("window.NodeIterator.prototype.root", "NodeIterator", result);
    return result;
  },
}, "root").get;
registerNativeFunction(root, "get root");
