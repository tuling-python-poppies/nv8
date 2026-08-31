import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { rowCells } from "./html-table-row-element-cells-getter.js";

export const deleteCell = {
  deleteCell(index) {
    requireElement(this);
    const normalized = Number(index);
    const cells = rowCells(this);
    const resolved = normalized === -1 ? cells.length - 1 : normalized;
    if (
      !Number.isInteger(normalized)
      || normalized < -1
      || resolved < 0
      || resolved >= cells.length
    ) {
      throw new DOMException("The index is not in the allowed range.", "IndexSizeError");
    }
    cells[resolved].remove();
    traceCall(
      "window.HTMLTableRowElement.prototype.deleteCell",
      "HTMLTableRowElement",
      [index],
      undefined,
    );
  },
}.deleteCell;
registerNativeFunction(deleteCell, "deleteCell");
