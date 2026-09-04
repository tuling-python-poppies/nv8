import { AnimationEffect, installAnimationEffectConstructor } from "../api/animation/animation-effect-constructor.js";
import { getComputedTiming } from "../api/animation/animation-effect-get-computed-timing.js";
import { getTiming } from "../api/animation/animation-effect-get-timing.js";
import { updateTiming } from "../api/animation/animation-effect-update-timing.js";
import { defineConstructorBacklink, definePrototypeMethod, defineToStringTag } from "../../engine/webidl/descriptor.js";

export function installAnimationEffect() {
  installAnimationEffectConstructor();
  definePrototypeMethod(AnimationEffect.prototype, "getComputedTiming", getComputedTiming);
  definePrototypeMethod(AnimationEffect.prototype, "getTiming", getTiming);
  definePrototypeMethod(AnimationEffect.prototype, "updateTiming", updateTiming);
  defineConstructorBacklink(AnimationEffect.prototype, AnimationEffect);
  defineToStringTag(AnimationEffect.prototype, "AnimationEffect");
}
