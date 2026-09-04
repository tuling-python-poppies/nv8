import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { animationEffectTiming } from "./animation-effect-state.js";
export const getComputedTiming = { getComputedTiming() { const result = animationEffectTiming(this, true); traceCall("window.AnimationEffect.prototype.getComputedTiming", "AnimationEffect", [], result); return result; } }.getComputedTiming;
registerNativeFunction(getComputedTiming, "getComputedTiming");
