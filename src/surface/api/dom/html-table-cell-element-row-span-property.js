import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { getAttributeValue, requireElement, setAttributeValue } from "./element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get rowSpan() {
    requireElement(this);
    const parsed = Number.parseInt(getAttributeValue(this, "rowspan") ?? "", 10);
    const result = Number.isFinite(parsed) && parsed >= 0 && parsed <= 65534 ? parsed : 1;
    traceGetter("window.HTMLTableCellElement.prototype.rowSpan", "HTMLTableCellElement", result);
    return result;
  },
  set rowSpan(value) {
    requireElement(this);
    setAttributeValue(this, "rowspan", `${Number(value) >>> 0}`);
  },
}, "rowSpan");
export const rowSpan = descriptor.get;
export const setRowSpan = descriptor.set;
registerNativeGetter(rowSpan, "rowSpan");
registerNativeFunction(setRowSpan, "set rowSpan");
