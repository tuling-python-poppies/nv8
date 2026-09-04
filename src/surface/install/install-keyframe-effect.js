import { KeyframeEffect, installKeyframeEffectConstructor } from "../api/animation/keyframe-effect-constructor.js";
import { target, setTarget } from "../api/animation/keyframe-effect-target-property.js";
import { pseudoElement, setPseudoElement } from "../api/animation/keyframe-effect-pseudo-element-property.js";
import { composite, setComposite } from "../api/animation/keyframe-effect-composite-property.js";
import { getKeyframes } from "../api/animation/keyframe-effect-get-keyframes.js";
import { setKeyframes } from "../api/animation/keyframe-effect-set-keyframes.js";
import { defineConstructorBacklink, definePrototypeAccessor, definePrototypeMethod, defineToStringTag } from "../../engine/webidl/descriptor.js";

export function installKeyframeEffect() {
  installKeyframeEffectConstructor();
  definePrototypeAccessor(KeyframeEffect.prototype, "target", target, setTarget);
  definePrototypeAccessor(KeyframeEffect.prototype, "pseudoElement", pseudoElement, setPseudoElement);
  definePrototypeAccessor(KeyframeEffect.prototype, "composite", composite, setComposite);
  definePrototypeMethod(KeyframeEffect.prototype, "getKeyframes", getKeyframes);
  definePrototypeMethod(KeyframeEffect.prototype, "setKeyframes", setKeyframes);
  defineConstructorBacklink(KeyframeEffect.prototype, KeyframeEffect);
  defineToStringTag(KeyframeEffect.prototype, "KeyframeEffect");
}
