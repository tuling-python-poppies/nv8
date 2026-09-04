import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { EventTarget } from "../event/event-target-constructor.js";

export function TextTrackCue() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(TextTrackCue, "TextTrackCue");

export function installTextTrackCueConstructor() {
  Object.setPrototypeOf(TextTrackCue.prototype, EventTarget.prototype);
  Object.setPrototypeOf(TextTrackCue, EventTarget);
  delete TextTrackCue.prototype.constructor;
  defineGlobalConstructor("TextTrackCue", TextTrackCue);
}
