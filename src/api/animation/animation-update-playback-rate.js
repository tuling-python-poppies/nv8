import { animationMethod } from "./animation-method.js";
import { updateAnimationPlaybackRate } from "./animation-state.js";
export const updatePlaybackRate = animationMethod("updatePlaybackRate", 1, (animation, args) => updateAnimationPlaybackRate(animation, args[0]));
