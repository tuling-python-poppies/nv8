import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireTextTrack } from "./text-track-state.js";
export const id = Object.getOwnPropertyDescriptor({ get id() {
  const result = requireTextTrack(this).id;
  traceGetter("window.TextTrack.prototype.id", "TextTrack", result);
  return result;
}}, "id").get;
registerNativeGetter(id, "id");
