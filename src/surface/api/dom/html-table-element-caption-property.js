import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { directTableChild, setDirectTableChild } from "./html-table-element-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get caption() {
    requireElement(this);
    const result = directTableChild(this, "caption");
    traceGetter("window.HTMLTableElement.prototype.caption", "HTMLTableElement", result);
    return result;
  },
  set caption(value) {
    requireElement(this);
    setDirectTableChild(this, "caption", value);
  },
}, "caption");
export const caption = descriptor.get;
export const setCaption = descriptor.set;
registerNativeGetter(caption, "caption");
registerNativeFunction(setCaption, "set caption");
