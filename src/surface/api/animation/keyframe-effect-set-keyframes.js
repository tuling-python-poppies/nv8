import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { setKeyframeEffectFrames } from "./keyframe-effect-state.js";
export const setKeyframes = { setKeyframes(keyframes) { setKeyframeEffectFrames(this, keyframes); traceCall("window.KeyframeEffect.prototype.setKeyframes", "KeyframeEffect", [keyframes], undefined); } }.setKeyframes;
registerNativeFunction(setKeyframes, "setKeyframes");
