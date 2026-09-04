import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { directTableChild, setDirectTableChild } from "./html-table-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get tHead() {
    requireElement(this);
    const result = directTableChild(this, "thead");
    traceGetter("window.HTMLTableElement.prototype.tHead", "HTMLTableElement", result);
    return result;
  },
  set tHead(value) {
    requireElement(this);
    setDirectTableChild(this, "thead", value);
  },
}, "tHead");
export const tHead = descriptor.get;
export const setTHead = descriptor.set;
registerNativeGetter(tHead, "tHead");
registerNativeFunction(setTHead, "set tHead");
