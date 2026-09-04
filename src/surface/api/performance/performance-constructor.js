import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { EventTarget } from "../event/event-target-constructor.js";

export function Performance() {
  throw new TypeError("Failed to construct 'Performance': Illegal constructor");
}

Object.setPrototypeOf(Performance.prototype, EventTarget.prototype);
Object.setPrototypeOf(Performance, EventTarget);
registerNativeFunction(Performance, "Performance");

export function installPerformanceConstructor() {
  delete Performance.prototype.constructor;
  defineToStringTag(Performance.prototype, "Performance");
  defineGlobalConstructor("Performance", Performance);
}

export function installPerformanceConstructorBacklink() {
  defineConstructorBacklink(Performance.prototype, Performance);
}
