import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

export function AnimationTimeline() {
  throw new TypeError("Failed to construct 'AnimationTimeline': Illegal constructor");
}
registerNativeFunction(AnimationTimeline, "AnimationTimeline");

export function installAnimationTimelineConstructor() {
  delete AnimationTimeline.prototype.constructor;
  defineGlobalConstructor("AnimationTimeline", AnimationTimeline);
}
