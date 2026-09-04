import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { EventTarget } from "../event/event-target-constructor.js";
export function MediaStreamTrack() {
  throw new TypeError(
    "Failed to construct 'MediaStreamTrack': Illegal constructor",
  );
}
registerNativeFunction(MediaStreamTrack, "MediaStreamTrack");
export function installMediaStreamTrackConstructor() {
  Object.setPrototypeOf(MediaStreamTrack.prototype, EventTarget.prototype);
  Object.setPrototypeOf(MediaStreamTrack, EventTarget);
  delete MediaStreamTrack.prototype.constructor;
  defineGlobalConstructor("MediaStreamTrack", MediaStreamTrack);
}
