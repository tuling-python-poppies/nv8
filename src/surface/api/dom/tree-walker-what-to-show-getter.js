import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireTreeWalker } from "./tree-walker-state.js";

export const whatToShow = Object.getOwnPropertyDescriptor({
  get whatToShow() {
    const result = requireTreeWalker(this).whatToShow;
    traceGetter(
      "window.TreeWalker.prototype.whatToShow",
      "TreeWalker",
      result,
    );
    return result;
  },
}, "whatToShow").get;
registerNativeFunction(whatToShow, "get whatToShow");
