import { animationMethod } from "./animation-method.js";
import { playAnimation } from "./animation-state.js";
export const play = animationMethod("play", 0, animation => playAnimation(animation));
