import { currentHref } from "../../navigation/navigation-state.js";
import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const toString = {
  toString() {
    requireLocation(this);
    const value = currentHref();
    traceCall("window.location.toString", "Location", [], value);
    return value;
  },
}.toString;

registerNativeFunction(toString, "toString");
