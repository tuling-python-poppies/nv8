import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { createHTMLCollection } from "./html-collection-state.js";
import { tableRows } from "./html-table-element-state.js";

const rowCollections = new WeakMap();
export const rows = Object.getOwnPropertyDescriptor({
  get rows() {
    requireElement(this);
    let result = rowCollections.get(this);
    if (result === undefined) {
      result = createHTMLCollection(() => tableRows(this));
      rowCollections.set(this, result);
    }
    traceGetter("window.HTMLTableElement.prototype.rows", "HTMLTableElement", result);
    return result;
  },
}, "rows").get;
registerNativeGetter(rows, "rows");
