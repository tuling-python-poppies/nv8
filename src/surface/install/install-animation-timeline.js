import { AnimationTimeline, installAnimationTimelineConstructor } from "../api/animation/animation-timeline-constructor.js";
import { defineConstructorBacklink, definePrototypeGetter, defineToStringTag } from "../../engine/webidl/descriptor.js";
import { animationTimelineGetterTable } from "../api/animation/animation-timeline-getter-members.js";

export function installAnimationTimeline() {
  installAnimationTimelineConstructor();
  for (const [name, entry] of animationTimelineGetterTable) definePrototypeGetter(AnimationTimeline.prototype, name, entry);
  defineConstructorBacklink(AnimationTimeline.prototype, AnimationTimeline);
  defineToStringTag(AnimationTimeline.prototype, "AnimationTimeline");
}
