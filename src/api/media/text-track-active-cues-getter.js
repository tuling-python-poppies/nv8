import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireTextTrack } from "./text-track-state.js";
export const activeCues = Object.getOwnPropertyDescriptor({ get activeCues() {
  const result = requireTextTrack(this).activeCues;
  traceGetter("window.TextTrack.prototype.activeCues", "TextTrack", result);
  return result;
}}, "activeCues").get;
registerNativeGetter(activeCues, "activeCues");
