import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireLocation } from "./location-state.js";

export const reload = {
  reload() {
    requireLocation(this);
    traceCall("window.location.reload", "Location", [], undefined);
  },
}.reload;

registerNativeFunction(reload, "reload");
