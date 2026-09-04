import { currentHref } from "../../../infra/navigation/navigation-state.js";
import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
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
