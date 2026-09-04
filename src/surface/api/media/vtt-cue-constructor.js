import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { traceConstruct } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { TextTrackCue } from "./text-track-cue-constructor.js";
import { initializeTextTrackCue } from "./text-track-cue-state.js";
import { initializeVTTCue } from "./vtt-cue-state.js";

export function VTTCue(startTime, endTime, text) {
  if (new.target === undefined || arguments.length < 3) {
    throw new TypeError("VTTCue requires startTime, endTime, and text");
  }
  const normalizedStartTime = Number(startTime);
  const normalizedEndTime = Number(endTime);
  const normalizedText = `${text}`;
  initializeTextTrackCue(this, normalizedStartTime, normalizedEndTime);
  initializeVTTCue(this, normalizedText);
  traceConstruct(
    "window.VTTCue",
    [normalizedStartTime, normalizedEndTime, normalizedText],
    "VTTCue",
  );
}
registerNativeFunction(VTTCue, "VTTCue");

export function installVTTCueConstructor() {
  Object.setPrototypeOf(VTTCue.prototype, TextTrackCue.prototype);
  Object.setPrototypeOf(VTTCue, TextTrackCue);
  delete VTTCue.prototype.constructor;
  defineGlobalConstructor("VTTCue", VTTCue);
}
