import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireCSSStyleDeclaration } from "./css-style-declaration-state.js";

export function cssStyleMethod(name, arity, operation) {
  const callback = {
    [name](...args) {
      requireCSSStyleDeclaration(this);
      const result = operation(this, args);
      traceCall(`window.CSSStyleDeclaration.prototype.${name}`, "CSSStyleDeclaration", args, result);
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}
