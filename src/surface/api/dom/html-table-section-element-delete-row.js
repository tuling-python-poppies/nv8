import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { sectionRows } from "./html-table-section-element-rows-getter.js";

export const deleteRow = {
  deleteRow(index) {
    requireElement(this);
    const normalized = Number(index);
    const rows = sectionRows(this);
    const resolved = normalized === -1 ? rows.length - 1 : normalized;
    if (
      !Number.isInteger(normalized)
      || normalized < -1
      || resolved < 0
      || resolved >= rows.length
    ) {
      throw new DOMException("The index is not in the allowed range.", "IndexSizeError");
    }
    rows[resolved].remove();
    traceCall(
      "window.HTMLTableSectionElement.prototype.deleteRow",
      "HTMLTableSectionElement",
      [index],
      undefined,
    );
  },
}.deleteRow;
registerNativeFunction(deleteRow, "deleteRow");
