import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { animationEffectTiming } from "./animation-effect-state.js";
export const getTiming = { getTiming() { const result = animationEffectTiming(this, false); traceCall("window.AnimationEffect.prototype.getTiming", "AnimationEffect", [], result); return result; } }.getTiming;
registerNativeFunction(getTiming, "getTiming");
