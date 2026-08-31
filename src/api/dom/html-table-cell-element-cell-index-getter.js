import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { requireNode } from "./node-state.js";

export const cellIndex = Object.getOwnPropertyDescriptor({
  get cellIndex() {
    requireElement(this);
    const parent = requireNode(this).parent;
    const result = parent?.localName === "tr"
      ? requireNode(parent).children.filter(
        child => child.localName === "td" || child.localName === "th",
      ).indexOf(this)
      : -1;
    traceGetter("window.HTMLTableCellElement.prototype.cellIndex", "HTMLTableCellElement", result);
    return result;
  },
}, "cellIndex").get;
registerNativeGetter(cellIndex, "cellIndex");
