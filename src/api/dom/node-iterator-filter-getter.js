import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireNodeIterator } from "./node-iterator-state.js";

export const filter = Object.getOwnPropertyDescriptor({
  get filter() {
    const result = requireNodeIterator(this).filter;
    traceGetter(
      "window.NodeIterator.prototype.filter",
      "NodeIterator",
      result,
    );
    return result;
  },
}, "filter").get;
registerNativeFunction(filter, "get filter");
