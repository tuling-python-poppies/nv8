import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { directTableChild, setDirectTableChild } from "./html-table-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get tFoot() {
    requireElement(this);
    const result = directTableChild(this, "tfoot");
    traceGetter("window.HTMLTableElement.prototype.tFoot", "HTMLTableElement", result);
    return result;
  },
  set tFoot(value) {
    requireElement(this);
    setDirectTableChild(this, "tfoot", value);
  },
}, "tFoot");
export const tFoot = descriptor.get;
export const setTFoot = descriptor.set;
registerNativeGetter(tFoot, "tFoot");
registerNativeFunction(setTFoot, "set tFoot");
