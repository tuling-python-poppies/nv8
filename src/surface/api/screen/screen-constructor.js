import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { EventTarget } from "../event/event-target-constructor.js";

export function Screen() {
  throw new TypeError("Failed to construct 'Screen': Illegal constructor");
}

Object.setPrototypeOf(Screen.prototype, EventTarget.prototype);
Object.setPrototypeOf(Screen, EventTarget);
registerNativeFunction(Screen, "Screen");

export function installScreenConstructor() {
  delete Screen.prototype.constructor;
  defineToStringTag(Screen.prototype, "Screen");
  defineGlobalConstructor("Screen", Screen);
}

export function installScreenConstructorBacklink() {
  defineConstructorBacklink(Screen.prototype, Screen);
}
