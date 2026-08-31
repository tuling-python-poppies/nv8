import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { createHTMLCollection } from "./html-collection-state.js";
import { requireNode } from "./node-state.js";

const collections = new WeakMap();
export const children = Object.getOwnPropertyDescriptor({
  get children() {
    requireNode(this);
    let value = collections.get(this);
    if (value === undefined) {
      value = createHTMLCollection(
        () => requireNode(this).children.filter(node => requireNode(node).nodeType === 1),
      );
      collections.set(this, value);
    }
    traceGetter("window.DocumentFragment.prototype.children", "DocumentFragment", value);
    return value;
  },
}, "children").get;
registerNativeGetter(children, "children");
