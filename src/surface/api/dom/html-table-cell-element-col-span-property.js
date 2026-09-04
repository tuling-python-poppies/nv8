import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { getAttributeValue, requireElement, setAttributeValue } from "./element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get colSpan() {
    requireElement(this);
    const parsed = Number.parseInt(getAttributeValue(this, "colspan") ?? "", 10);
    const result = Number.isFinite(parsed) && parsed >= 1 && parsed <= 1000 ? parsed : 1;
    traceGetter("window.HTMLTableCellElement.prototype.colSpan", "HTMLTableCellElement", result);
    return result;
  },
  set colSpan(value) {
    requireElement(this);
    setAttributeValue(this, "colspan", `${Number(value) >>> 0}`);
  },
}, "colSpan");
export const colSpan = descriptor.get;
export const setColSpan = descriptor.set;
registerNativeGetter(colSpan, "colSpan");
registerNativeFunction(setColSpan, "set colSpan");
