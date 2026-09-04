import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireTextTrack } from "./text-track-state.js";
export const kind = Object.getOwnPropertyDescriptor({ get kind() {
  const result = requireTextTrack(this).kind;
  traceGetter("window.TextTrack.prototype.kind", "TextTrack", result);
  return result;
}}, "kind").get;
registerNativeGetter(kind, "kind");
