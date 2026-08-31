import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { parseFragment } from "./html-parser.js";
import { serializeChildren } from "./html-serializer.js";
import { replaceChildrenAlgorithm } from "./parent-node-algorithms.js";
import { requireNode } from "./node-state.js";
import { requireShadowRoot } from "./shadow-root-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get innerHTML() {
    requireShadowRoot(this);
    const result = serializeChildren(this);
    traceGetter(
      "window.ShadowRoot.prototype.innerHTML",
      "ShadowRoot",
      result,
    );
    return result;
  },
  set innerHTML(value) {
    requireShadowRoot(this);
    const fragment = parseFragment(
      requireNode(this).ownerDocument,
      `${value}`,
    );
    replaceChildrenAlgorithm(this, [fragment]);
  },
}, "innerHTML");

export const innerHTML = descriptor.get;
export const setInnerHTML = descriptor.set;
registerNativeGetter(innerHTML, "innerHTML");
registerNativeFunction(setInnerHTML, "set innerHTML");
