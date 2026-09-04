import { traceConstruct } from "../../../infra/trace/trace-function.js";
import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { EventTarget } from "../event/event-target-constructor.js";
import {
  initializeMediaStream,
  normalizeMediaStreamTracks,
} from "./media-stream-state.js";
export function MediaStream() {
  if (new.target === undefined) {
    throw new TypeError(
      "Failed to construct 'MediaStream': Please use the 'new' operator, this DOM object constructor cannot be called as a function.",
    );
  }
  const tracks = arguments[0] === undefined
    ? []
    : normalizeMediaStreamTracks(arguments[0]);
  initializeMediaStream(this, tracks);
  traceConstruct("window.MediaStream", arguments[0] === undefined ? [] : [arguments[0]], "MediaStream");
}
registerNativeFunction(MediaStream, "MediaStream");
export function installMediaStreamConstructor() {
  Object.setPrototypeOf(MediaStream.prototype, EventTarget.prototype);
  Object.setPrototypeOf(MediaStream, EventTarget);
  delete MediaStream.prototype.constructor;
  defineGlobalConstructor("MediaStream", MediaStream);
}
