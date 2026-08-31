import { animationMethod } from "./animation-method.js";
import { cancelAnimation } from "./animation-state.js";
export const cancel = animationMethod("cancel", 0, animation => cancelAnimation(animation));
