import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { EventTarget } from "../event/event-target-constructor.js";

export function TextTrack() {
  throw new TypeError(
    "Failed to construct 'TextTrack': Illegal constructor",
  );
}
registerNativeFunction(TextTrack, "TextTrack");

export function installTextTrackConstructor() {
  Object.setPrototypeOf(TextTrack.prototype, EventTarget.prototype);
  Object.setPrototypeOf(TextTrack, EventTarget);
  delete TextTrack.prototype.constructor;
  defineGlobalConstructor("TextTrack", TextTrack);
}
