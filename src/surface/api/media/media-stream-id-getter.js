import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireMediaStream } from "./media-stream-state.js";
export const id = Object.getOwnPropertyDescriptor({ get id() {
  const result = requireMediaStream(this).id;
  traceGetter("window.MediaStream.prototype.id", "MediaStream", result);
  return result;
}}, "id").get;
registerNativeGetter(id, "id");
