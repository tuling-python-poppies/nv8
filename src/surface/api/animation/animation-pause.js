import { animationMethod } from "./animation-method.js";
import { pauseAnimation } from "./animation-state.js";
export const pause = animationMethod("pause", 0, animation => pauseAnimation(animation));
