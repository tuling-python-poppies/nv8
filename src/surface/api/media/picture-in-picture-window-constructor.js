import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { EventTarget } from "../event/event-target-constructor.js";

export function PictureInPictureWindow() {
  throw new TypeError(
    "Failed to construct 'PictureInPictureWindow': Illegal constructor",
  );
}
registerNativeFunction(PictureInPictureWindow, "PictureInPictureWindow");

export function installPictureInPictureWindowConstructor() {
  Object.setPrototypeOf(PictureInPictureWindow.prototype, EventTarget.prototype);
  Object.setPrototypeOf(PictureInPictureWindow, EventTarget);
  delete PictureInPictureWindow.prototype.constructor;
  defineGlobalConstructor("PictureInPictureWindow", PictureInPictureWindow);
}
