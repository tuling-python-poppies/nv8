import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { keyframeEffectFrames } from "./keyframe-effect-state.js";
export const getKeyframes = { getKeyframes() { const result = keyframeEffectFrames(this); traceCall("window.KeyframeEffect.prototype.getKeyframes", "KeyframeEffect", [], result); return result; } }.getKeyframes;
registerNativeFunction(getKeyframes, "getKeyframes");
