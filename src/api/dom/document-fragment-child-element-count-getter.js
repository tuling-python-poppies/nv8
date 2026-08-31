import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireNode } from "./node-state.js";

export const childElementCount = Object.getOwnPropertyDescriptor({
  get childElementCount() {
    const value = requireNode(this).children.filter(
      node => requireNode(node).nodeType === 1,
    ).length;
    traceGetter("window.DocumentFragment.prototype.childElementCount", "DocumentFragment", value);
    return value;
  },
}, "childElementCount").get;
registerNativeGetter(childElementCount, "childElementCount");
