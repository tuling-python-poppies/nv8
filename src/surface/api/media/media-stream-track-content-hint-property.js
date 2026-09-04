import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireMediaStreamTrack } from "./media-stream-track-state.js";
const audioHints = new Set(["", "speech", "speech-recognition", "music"]);
const videoHints = new Set(["", "motion", "detail", "text"]);
const descriptor = Object.getOwnPropertyDescriptor({
  get contentHint() {
    const result = requireMediaStreamTrack(this).contentHint;
    traceGetter("window.MediaStreamTrack.prototype.contentHint", "MediaStreamTrack", result);
    return result;
  },
  set contentHint(value) {
    const state = requireMediaStreamTrack(this);
    const normalized = `${value}`;
    const accepted = state.kind === "audio" ? audioHints : videoHints;
    if (accepted.has(normalized)) state.contentHint = normalized;
  },
}, "contentHint");
export const contentHint = descriptor.get;
export const setContentHint = descriptor.set;
registerNativeGetter(contentHint, "contentHint");
registerNativeFunction(setContentHint, "set contentHint");
