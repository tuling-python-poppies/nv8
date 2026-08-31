import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireNode } from "./node-state.js";

export const lastElementChild = Object.getOwnPropertyDescriptor({
  get lastElementChild() {
    const elements = requireNode(this).children.filter(
      node => requireNode(node).nodeType === 1,
    );
    const value = elements.at(-1) ?? null;
    traceGetter("window.DocumentFragment.prototype.lastElementChild", "DocumentFragment", value);
    return value;
  },
}, "lastElementChild").get;
registerNativeGetter(lastElementChild, "lastElementChild");
