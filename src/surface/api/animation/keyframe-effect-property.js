import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireKeyframeEffect } from "./keyframe-effect-state.js";

export function keyframeEffectProperty(name, setterOperation) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const result = requireKeyframeEffect(this)[name];
      traceGetter(`window.KeyframeEffect.prototype.${name}`, "KeyframeEffect", result);
      return result;
    },
    set [name](value) {
      setterOperation(this, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  registerNativeFunction(descriptor.set, `set ${name}`);
  return descriptor;
}
