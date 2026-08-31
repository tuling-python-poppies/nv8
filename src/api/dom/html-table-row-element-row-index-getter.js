import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { descendants, requireNode } from "./node-state.js";

export const rowIndex = Object.getOwnPropertyDescriptor({
  get rowIndex() {
    requireElement(this);
    const table = tableAncestor(this);
    const result = table === null
      ? -1
      : descendants(table).filter(
        node => node.localName === "tr" && tableAncestor(node) === table,
      ).indexOf(this);
    traceGetter(
      "window.HTMLTableRowElement.prototype.rowIndex",
      "HTMLTableRowElement",
      result,
    );
    return result;
  },
}, "rowIndex").get;
registerNativeGetter(rowIndex, "rowIndex");

export function tableAncestor(node) {
  let current = requireNode(node).parent;
  while (current !== null) {
    if (current.localName === "table") {
      return current;
    }
    current = requireNode(current).parent;
  }
  return null;
}
