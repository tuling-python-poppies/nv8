import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { EventTarget } from "../event/event-target-constructor.js";
export function TextTrackList() {
  throw new TypeError(
    "Failed to construct 'TextTrackList': Illegal constructor",
  );
}
registerNativeFunction(TextTrackList, "TextTrackList");
export function installTextTrackListConstructor() {
  Object.setPrototypeOf(TextTrackList.prototype, EventTarget.prototype);
  Object.setPrototypeOf(TextTrackList, EventTarget);
  delete TextTrackList.prototype.constructor;
  defineGlobalConstructor("TextTrackList", TextTrackList);
}
