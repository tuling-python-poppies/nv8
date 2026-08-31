import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { EventTarget } from "../event/event-target-constructor.js";

export function MediaQueryList() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(MediaQueryList, "MediaQueryList");

export function installMediaQueryListConstructor() {
  Object.setPrototypeOf(MediaQueryList.prototype, EventTarget.prototype);
  Object.setPrototypeOf(MediaQueryList, EventTarget);
  delete MediaQueryList.prototype.constructor;
  defineGlobalConstructor("MediaQueryList", MediaQueryList);
}
