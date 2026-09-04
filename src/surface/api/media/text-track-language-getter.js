import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireTextTrack } from "./text-track-state.js";
export const language = Object.getOwnPropertyDescriptor({ get language() {
  const result = requireTextTrack(this).language;
  traceGetter("window.TextTrack.prototype.language", "TextTrack", result);
  return result;
}}, "language").get;
registerNativeGetter(language, "language");
