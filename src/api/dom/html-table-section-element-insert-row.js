import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { sectionRows } from "./html-table-section-element-rows-getter.js";

export const insertRow = {
  insertRow() {
    requireElement(this);
    const index = arguments.length === 0 ? -1 : Number(arguments[0]);
    const rows = sectionRows(this);
    if (!Number.isInteger(index) || index < -1 || index > rows.length) {
      throw new DOMException("The index is not in the allowed range.", "IndexSizeError");
    }
    const row = this.ownerDocument.createElement("tr");
    this.insertBefore(row, index === -1 ? null : rows[index] ?? null);
    traceCall(
      "window.HTMLTableSectionElement.prototype.insertRow",
      "HTMLTableSectionElement",
      [...arguments],
      row,
    );
    return row;
  },
}.insertRow;
registerNativeFunction(insertRow, "insertRow");
