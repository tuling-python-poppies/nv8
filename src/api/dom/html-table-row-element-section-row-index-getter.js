import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { requireNode } from "./node-state.js";

export const sectionRowIndex = Object.getOwnPropertyDescriptor({
  get sectionRowIndex() {
    requireElement(this);
    const parent = requireNode(this).parent;
    const result = parent === null
      ? -1
      : requireNode(parent).children.filter(
        child => child.localName === "tr",
      ).indexOf(this);
    traceGetter(
      "window.HTMLTableRowElement.prototype.sectionRowIndex",
      "HTMLTableRowElement",
      result,
    );
    return result;
  },
}, "sectionRowIndex").get;
registerNativeGetter(sectionRowIndex, "sectionRowIndex");
