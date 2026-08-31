import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

export function AnimationEffect() {
  throw new TypeError("Failed to construct 'AnimationEffect': Illegal constructor");
}
registerNativeFunction(AnimationEffect, "AnimationEffect");

export function installAnimationEffectConstructor() {
  delete AnimationEffect.prototype.constructor;
  defineGlobalConstructor("AnimationEffect", AnimationEffect);
}
