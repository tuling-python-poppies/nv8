import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireCSSStyleRule } from "./css-style-rule-state.js";

export function cssStyleRuleReadonlyDescriptor(name, read) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const result = read(requireCSSStyleRule(this));
      traceGetter(`window.CSSStyleRule.prototype.${name}`, "CSSStyleRule", result);
      return result;
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  return descriptor;
}

export function cssStyleRuleAccessorDescriptor(name, read, write) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      const result = read(requireCSSStyleRule(this));
      traceGetter(`window.CSSStyleRule.prototype.${name}`, "CSSStyleRule", result);
      return result;
    },
    set [name](value) {
      write(requireCSSStyleRule(this), value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  registerNativeFunction(descriptor.set, `set ${name}`);
  return descriptor;
}
