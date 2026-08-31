import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { resetMediaElement } from "./html-media-element-state.js";

export const load = {
  load() {
    resetMediaElement(this);
    traceCall("window.HTMLMediaElement.prototype.load", "HTMLMediaElement", [], undefined);
  },
}.load;
registerNativeFunction(load, "load");
