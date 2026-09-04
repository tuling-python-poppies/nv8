import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireVTTCue } from "./vtt-cue-state.js";
const descriptor = Object.getOwnPropertyDescriptor({
  get text() {
    const result = requireVTTCue(this).text;
    traceGetter("window.VTTCue.prototype.text", "VTTCue", result);
    return result;
  },
  set text(value) {
    requireVTTCue(this).text = `${value}`;
  },
}, "text");
export const text = descriptor.get;
export const setText = descriptor.set;
registerNativeGetter(text, "text");
registerNativeFunction(setText, "set text");
