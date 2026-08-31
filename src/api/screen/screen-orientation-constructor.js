import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { EventTarget } from "../event/event-target-constructor.js";

export function ScreenOrientation() {
  throw new TypeError(
    "Failed to construct 'ScreenOrientation': Illegal constructor",
  );
}

Object.setPrototypeOf(ScreenOrientation.prototype, EventTarget.prototype);
Object.setPrototypeOf(ScreenOrientation, EventTarget);
registerNativeFunction(ScreenOrientation, "ScreenOrientation");

export function installScreenOrientationConstructor() {
  delete ScreenOrientation.prototype.constructor;
  defineToStringTag(ScreenOrientation.prototype, "ScreenOrientation");
  defineGlobalConstructor("ScreenOrientation", ScreenOrientation);
}

export function installScreenOrientationConstructorBacklink() {
  defineConstructorBacklink(
    ScreenOrientation.prototype,
    ScreenOrientation,
  );
}
