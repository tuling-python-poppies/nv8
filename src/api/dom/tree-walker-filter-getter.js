import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireTreeWalker } from "./tree-walker-state.js";

export const filter = Object.getOwnPropertyDescriptor({
  get filter() {
    const result = requireTreeWalker(this).filter;
    traceGetter("window.TreeWalker.prototype.filter", "TreeWalker", result);
    return result;
  },
}, "filter").get;
registerNativeFunction(filter, "get filter");
