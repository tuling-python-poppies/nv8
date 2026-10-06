import { AnimationTimeline, installAnimationTimelineConstructor } from "../api/animation/animation-timeline-constructor.js";
import {
  currentTime,
  duration,
} from "../api/animation/animation-timeline-getter-members.js";
import { defineConstructorBacklink, definePrototypeGetter, defineToStringTag } from "../../engine/webidl/descriptor.js";

export function installAnimationTimeline() {
  installAnimationTimelineConstructor();
  definePrototypeGetter(AnimationTimeline.prototype, "currentTime", currentTime);
  definePrototypeGetter(AnimationTimeline.prototype, "duration", duration);
  defineConstructorBacklink(AnimationTimeline.prototype, AnimationTimeline);
  defineToStringTag(AnimationTimeline.prototype, "AnimationTimeline");
}
