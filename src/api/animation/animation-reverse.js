import { animationMethod } from "./animation-method.js";
import { reverseAnimation } from "./animation-state.js";
export const reverse = animationMethod("reverse", 0, animation => reverseAnimation(animation));
