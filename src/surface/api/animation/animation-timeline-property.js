import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireAnimationTimeline } from "./animation-timeline-state.js";

export function animationTimelineGetter(name) {
  const getter = Object.getOwnPropertyDescriptor({
    get [name]() {
      const result = requireAnimationTimeline(this)[name];
      traceGetter(`window.AnimationTimeline.prototype.${name}`, "AnimationTimeline", result);
      return result;
    },
  }, name).get;
  registerNativeGetter(getter, name);
  return getter;
}
