import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { createHTMLCollection } from "./html-collection-state.js";
import { requireNode } from "./node-state.js";

const rowCollections = new WeakMap();

export function sectionRows(section) {
  return requireNode(section).children.filter(child => child.localName === "tr");
}

export const rows = Object.getOwnPropertyDescriptor({
  get rows() {
    requireElement(this);
    let result = rowCollections.get(this);
    if (result === undefined) {
      result = createHTMLCollection(() => sectionRows(this));
      rowCollections.set(this, result);
    }
    traceGetter(
      "window.HTMLTableSectionElement.prototype.rows",
      "HTMLTableSectionElement",
      result,
    );
    return result;
  },
}, "rows").get;
registerNativeGetter(rows, "rows");
