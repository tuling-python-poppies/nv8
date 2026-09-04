import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { tableBodies, tableRows } from "./html-table-element-state.js";

export const insertRow = {
  insertRow() {
    requireElement(this);
    const index = arguments.length === 0 ? -1 : Number(arguments[0]);
    const rows = tableRows(this);
    if (!Number.isInteger(index) || index < -1 || index > rows.length) {
      throw new DOMException("The index is not in the allowed range.", "IndexSizeError");
    }
    const row = this.ownerDocument.createElement("tr");
    if (rows.length === 0) {
      const bodies = tableBodies(this);
      (bodies.at(-1) ?? this).append(row);
    } else if (index === -1 || index === rows.length) {
      rows.at(-1).parentNode.append(row);
    } else {
      rows[index].parentNode.insertBefore(row, rows[index]);
    }
    traceCall("window.HTMLTableElement.prototype.insertRow", "HTMLTableElement", [...arguments], row);
    return row;
  },
}.insertRow;
registerNativeFunction(insertRow, "insertRow");
