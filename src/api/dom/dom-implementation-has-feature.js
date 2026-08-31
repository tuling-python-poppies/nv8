import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  requireDOMImplementation,
} from "./dom-implementation-constructor.js";

export const hasFeature = {
  hasFeature() {
    requireDOMImplementation(this);
    const result = true;
    traceCall(
      "window.DOMImplementation.prototype.hasFeature",
      "DOMImplementation",
      [arguments[0], arguments[1]],
      result,
    );
    return result;
  },
}.hasFeature;
registerNativeFunction(hasFeature, "hasFeature");
