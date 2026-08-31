import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireRemotePlayback } from "./remote-playback-state.js";
export const prompt = {
  prompt() {
    requireRemotePlayback(this);
    const result = Promise.resolve(undefined);
    traceCall("window.RemotePlayback.prototype.prompt", "RemotePlayback", [], result);
    return result;
  },
}.prompt;
registerNativeFunction(prompt, "prompt");
