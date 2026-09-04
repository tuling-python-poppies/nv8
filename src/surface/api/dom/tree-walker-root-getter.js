import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireTreeWalker } from "./tree-walker-state.js";

export const root = Object.getOwnPropertyDescriptor({
  get root() {
    const result = requireTreeWalker(this).root;
    traceGetter("window.TreeWalker.prototype.root", "TreeWalker", result);
    return result;
  },
}, "root").get;
registerNativeFunction(root, "get root");
