import { AnimationTimeline, installAnimationTimelineConstructor } from "../api/animation/animation-timeline-constructor.js";
import { currentTime } from "../api/animation/animation-timeline-current-time-getter.js";
import { duration } from "../api/animation/animation-timeline-duration-getter.js";
import { defineConstructorBacklink, definePrototypeGetter, defineToStringTag } from "../webidl/descriptor.js";

export function installAnimationTimeline() {
  installAnimationTimelineConstructor();
  definePrototypeGetter(AnimationTimeline.prototype, "currentTime", currentTime);
  definePrototypeGetter(AnimationTimeline.prototype, "duration", duration);
  defineConstructorBacklink(AnimationTimeline.prototype, AnimationTimeline);
  defineToStringTag(AnimationTimeline.prototype, "AnimationTimeline");
}
