import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { EventTarget } from "../event/event-target-constructor.js";
export function RemotePlayback() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(RemotePlayback, "RemotePlayback");
export function installRemotePlaybackConstructor() {
  Object.setPrototypeOf(RemotePlayback.prototype, EventTarget.prototype);
  Object.setPrototypeOf(RemotePlayback, EventTarget);
  delete RemotePlayback.prototype.constructor;
  defineGlobalConstructor("RemotePlayback", RemotePlayback);
}
