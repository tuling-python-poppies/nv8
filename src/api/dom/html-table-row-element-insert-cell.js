import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { rowCells } from "./html-table-row-element-cells-getter.js";

export const insertCell = {
  insertCell() {
    requireElement(this);
    const index = arguments.length === 0 ? -1 : Number(arguments[0]);
    const cells = rowCells(this);
    if (!Number.isInteger(index) || index < -1 || index > cells.length) {
      throw new DOMException("The index is not in the allowed range.", "IndexSizeError");
    }
    const cell = this.ownerDocument.createElement("td");
    this.insertBefore(cell, index === -1 ? null : cells[index] ?? null);
    traceCall(
      "window.HTMLTableRowElement.prototype.insertCell",
      "HTMLTableRowElement",
      [...arguments],
      cell,
    );
    return cell;
  },
}.insertCell;
registerNativeFunction(insertCell, "insertCell");
