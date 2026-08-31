import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { EventTarget } from "../event/event-target-constructor.js";

export function AbortSignal() {
  throw new TypeError("Failed to construct 'AbortSignal': Illegal constructor");
}

Object.setPrototypeOf(AbortSignal, EventTarget);
Object.setPrototypeOf(AbortSignal.prototype, EventTarget.prototype);
registerNativeFunction(AbortSignal, "AbortSignal");

export function installAbortSignalConstructor() {
  delete AbortSignal.prototype.constructor;
  defineToStringTag(AbortSignal.prototype, "AbortSignal");
  defineGlobalConstructor("AbortSignal", AbortSignal);
}

export function installAbortSignalConstructorBacklink() {
  defineConstructorBacklink(AbortSignal.prototype, AbortSignal);
}
