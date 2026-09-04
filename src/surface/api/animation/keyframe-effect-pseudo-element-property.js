import { keyframeEffectProperty } from "./keyframe-effect-property.js";
import { setKeyframePseudoElement } from "./keyframe-effect-state.js";
const descriptor = keyframeEffectProperty("pseudoElement", setKeyframePseudoElement);
export const pseudoElement = descriptor.get;
export const setPseudoElement = descriptor.set;
