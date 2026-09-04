import { animationMethod } from "./animation-method.js";
import { finishAnimation } from "./animation-state.js";
export const finish = animationMethod("finish", 0, animation => finishAnimation(animation));
