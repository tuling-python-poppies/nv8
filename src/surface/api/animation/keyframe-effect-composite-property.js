import { keyframeEffectProperty } from "./keyframe-effect-property.js";
import { setKeyframeComposite } from "./keyframe-effect-state.js";
const descriptor = keyframeEffectProperty("composite", setKeyframeComposite);
export const composite = descriptor.get;
export const setComposite = descriptor.set;
