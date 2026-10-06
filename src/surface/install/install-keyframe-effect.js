import { KeyframeEffect, installKeyframeEffectConstructor } from "../api/animation/keyframe-effect-constructor.js";
import { getKeyframes } from "../api/animation/keyframe-effect-get-keyframes.js";
import { setKeyframes } from "../api/animation/keyframe-effect-set-keyframes.js";
import { defineConstructorBacklink, definePrototypeAccessor, definePrototypeMethod, defineToStringTag } from "../../engine/webidl/descriptor.js";
import { keyframeEffectPropertyTable } from "../api/animation/keyframe-effect-property-members.js";

export function installKeyframeEffect() {
  installKeyframeEffectConstructor();
  for (const [name, entry] of keyframeEffectPropertyTable) definePrototypeAccessor(KeyframeEffect.prototype, name, entry.get, entry.set);
  definePrototypeMethod(KeyframeEffect.prototype, "getKeyframes", getKeyframes);
  definePrototypeMethod(KeyframeEffect.prototype, "setKeyframes", setKeyframes);
  defineConstructorBacklink(KeyframeEffect.prototype, KeyframeEffect);
  defineToStringTag(KeyframeEffect.prototype, "KeyframeEffect");
}
