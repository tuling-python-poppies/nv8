import { traceConstruct } from "../../trace/trace-function.js";
import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { AnimationTimeline } from "./animation-timeline-constructor.js";
import { initializeAnimationTimeline } from "./animation-timeline-state.js";

export function DocumentTimeline() {
  if (new.target === undefined) throw new TypeError("Please use the 'new' operator, this DOM object constructor cannot be called as a function.");
  const options = arguments[0];
  const originTime = options !== null && typeof options === "object"
    ? Number(options.originTime ?? 0)
    : 0;
  initializeAnimationTimeline(this, -originTime, null);
  traceConstruct("window.DocumentTimeline", [...arguments], "DocumentTimeline");
}
registerNativeFunction(DocumentTimeline, "DocumentTimeline");

export function installDocumentTimelineConstructor() {
  Object.setPrototypeOf(DocumentTimeline.prototype, AnimationTimeline.prototype);
  Object.setPrototypeOf(DocumentTimeline, AnimationTimeline);
  delete DocumentTimeline.prototype.constructor;
  defineGlobalConstructor("DocumentTimeline", DocumentTimeline);
}
