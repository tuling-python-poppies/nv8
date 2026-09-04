import { traceConstruct } from "../../../infra/trace/trace-function.js";
import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { AnimationEffect } from "./animation-effect-constructor.js";
import { initializeKeyframeEffect } from "./keyframe-effect-state.js";

export function KeyframeEffect(target) {
  if (new.target === undefined) throw new TypeError("Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
  if (arguments.length === 0) {
    throw new TypeError("Failed to construct 'KeyframeEffect': 1 argument required, but only 0 present.");
  }
  initializeKeyframeEffect(this, target, arguments[1], arguments[2]);
  traceConstruct("window.KeyframeEffect", [...arguments], "KeyframeEffect");
}
registerNativeFunction(KeyframeEffect, "KeyframeEffect");

export function installKeyframeEffectConstructor() {
  Object.setPrototypeOf(KeyframeEffect.prototype, AnimationEffect.prototype);
  Object.setPrototypeOf(KeyframeEffect, AnimationEffect);
  delete KeyframeEffect.prototype.constructor;
  defineGlobalConstructor("KeyframeEffect", KeyframeEffect);
}
