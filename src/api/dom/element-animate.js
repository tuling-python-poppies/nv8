import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Animation } from "../animation/animation-constructor.js";
import { KeyframeEffect } from "../animation/keyframe-effect-constructor.js";
import { requireElement } from "./element-state.js";

export const animate = {
  animate(keyframes) {
    requireElement(this);
    const options = arguments[1];
    const effect = new KeyframeEffect(this, keyframes, options);
    const timeline = options !== null && typeof options === "object"
      && Object.hasOwn(options, "timeline")
      ? options.timeline
      : undefined;
    const animation = timeline === undefined
      ? new Animation(effect)
      : new Animation(effect, timeline);
    if (options !== null && typeof options === "object") {
      if (options.id !== undefined) animation.id = options.id;
      if (options.rangeStart !== undefined) animation.rangeStart = options.rangeStart;
      if (options.rangeEnd !== undefined) animation.rangeEnd = options.rangeEnd;
    }
    animation.play();
    traceCall("window.Element.prototype.animate", "Element", [...arguments], animation);
    return animation;
  },
}.animate;
registerNativeFunction(animate, "animate");
