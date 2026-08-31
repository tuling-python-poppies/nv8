import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireMediaElement } from "./html-media-element-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get controlsList() {
    const result = requireMediaElement(this).controlsList;
    traceGetter("window.HTMLMediaElement.prototype.controlsList", "HTMLMediaElement", result);
    return result;
  },
  set controlsList(value) {
    requireMediaElement(this);
    this.setAttribute("controlslist", `${value}`);
  },
}, "controlsList");
export const controlsList = descriptor.get;
export const setControlsList = descriptor.set;
registerNativeGetter(controlsList, "controlsList");
registerNativeFunction(setControlsList, "set controlsList");
