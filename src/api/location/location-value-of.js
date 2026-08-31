import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const valueOf = {
  valueOf() {
    requireLocation(this);
    traceCall("window.location.valueOf", "Location", [], this);
    return this;
  },
}.valueOf;

registerNativeFunction(valueOf, "valueOf");
