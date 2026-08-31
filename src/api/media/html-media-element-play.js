import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { requireMediaElement } from "./html-media-element-state.js";

export const play = {
  play() {
    const state = requireMediaElement(this);
    state.paused = false;
    state.hasPlayed = true;
    state.ended = false;
    const result = Promise.resolve(undefined);
    traceCall("window.HTMLMediaElement.prototype.play", "HTMLMediaElement", [], result);
    return result;
  },
}.play;
registerNativeFunction(play, "play");
