import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { updateAnimationEffectTiming } from "./animation-effect-state.js";
export const updateTiming = { updateTiming(options = {}) { updateAnimationEffectTiming(this, options); traceCall("window.AnimationEffect.prototype.updateTiming", "AnimationEffect", [...arguments], undefined); } }.updateTiming;
Object.defineProperty(updateTiming, "length", { value: 0 });
registerNativeFunction(updateTiming, "updateTiming");
