import { animationMethod } from "./animation-method.js";
import { commitAnimationStyles } from "./animation-state.js";
export const commitStyles = animationMethod("commitStyles", 0, animation => commitAnimationStyles(animation));
