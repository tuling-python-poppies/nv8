import { keyframeEffectProperty } from "./keyframe-effect-property.js";
import { setKeyframeTarget } from "./keyframe-effect-state.js";
const descriptor = keyframeEffectProperty("target", setKeyframeTarget);
export const target = descriptor.get;
export const setTarget = descriptor.set;
