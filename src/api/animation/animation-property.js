import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../webidl/native-function.js";
import { requireAnimation, setAnimationProperty } from "./animation-state.js";

export function animationProperty(name, readonly = false, select = record => record[name]) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const result = select(requireAnimation(this));
      traceGetter(`window.Animation.prototype.${name}`, "Animation", result);
      return result;
    },
    set [name](value) {
      setAnimationProperty(this, name, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  if (readonly) return { get: descriptor.get };
  registerNativeFunction(descriptor.set, `set ${name}`);
  return descriptor;
}
