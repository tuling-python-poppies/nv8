import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireCSSRule } from "./css-rule-state.js";

export function cssRuleReadonlyDescriptor(name, read) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const result = read(requireCSSRule(this), this);
      traceGetter(`window.CSSRule.prototype.${name}`, "CSSRule", result);
      return result;
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  return descriptor;
}

export function cssRuleAccessorDescriptor(name, read, write) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const result = read(requireCSSRule(this), this);
      traceGetter(`window.CSSRule.prototype.${name}`, "CSSRule", result);
      return result;
    },
    set [name](value) {
      requireCSSRule(this);
      write(this, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  registerNativeFunction(descriptor.set, `set ${name}`);
  return descriptor;
}
