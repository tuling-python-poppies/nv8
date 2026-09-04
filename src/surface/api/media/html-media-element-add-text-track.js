import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireMediaElement } from "./html-media-element-state.js";
import { appendTextTrack } from "./text-track-list-state.js";
import { createTextTrack } from "./text-track-state.js";

export const addTextTrack = {
  addTextTrack(kind, label = "", language = "") {
    const state = requireMediaElement(this);
    const result = createTextTrack(`${kind}`, `${label}`, `${language}`);
    appendTextTrack(state.textTracks, result);
    traceCall(
      "window.HTMLMediaElement.prototype.addTextTrack",
      "HTMLMediaElement",
      arguments.length < 2
        ? [kind]
        : arguments.length < 3 ? [kind, label] : [kind, label, language],
      result,
    );
    return result;
  },
}.addTextTrack;
registerNativeFunction(addTextTrack, "addTextTrack");
