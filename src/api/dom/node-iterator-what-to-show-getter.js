import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireNodeIterator } from "./node-iterator-state.js";

export const whatToShow = Object.getOwnPropertyDescriptor({
  get whatToShow() {
    const result = requireNodeIterator(this).whatToShow;
    traceGetter(
      "window.NodeIterator.prototype.whatToShow",
      "NodeIterator",
      result,
    );
    return result;
  },
}, "whatToShow").get;
registerNativeFunction(whatToShow, "get whatToShow");
