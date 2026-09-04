import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireNode } from "./node-state.js";

export const firstElementChild = Object.getOwnPropertyDescriptor({
  get firstElementChild() {
    const value = requireNode(this).children.find(
      node => requireNode(node).nodeType === 1,
    ) ?? null;
    traceGetter("window.DocumentFragment.prototype.firstElementChild", "DocumentFragment", value);
    return value;
  },
}, "firstElementChild").get;
registerNativeGetter(firstElementChild, "firstElementChild");
