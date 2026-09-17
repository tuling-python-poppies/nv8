import { traceConstruct } from "../../../infra/trace/trace-function.js";
import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { EventTarget } from "../event/event-target-constructor.js";
import { initializeAnimation } from "./animation-state.js";

export function Animation() {
  if (new.target === undefined) throw new TypeError("Animation must be constructed");
  initializeAnimation(this, arguments[0], arguments.length < 2 ? undefined : arguments[1]);
  traceConstruct("window.Animation", [...arguments], "Animation");
}
registerNativeFunction(Animation, "Animation");

export function installAnimationConstructor() {
  Object.setPrototypeOf(Animation.prototype, EventTarget.prototype);
  Object.setPrototypeOf(Animation, EventTarget);
  delete Animation.prototype.constructor;
  defineGlobalConstructor("Animation", Animation);
}
