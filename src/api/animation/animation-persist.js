import { animationMethod } from "./animation-method.js";
import { persistAnimation } from "./animation-state.js";
export const persist = animationMethod("persist", 0, animation => persistAnimation(animation));
