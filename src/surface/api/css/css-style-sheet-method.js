import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireCSSStyleSheet } from "./css-style-sheet-state.js";

export function cssStyleSheetMethod(name, arity, operation) {
  const callback = {
    [name](...args) {
      requireCSSStyleSheet(this);
      const result = operation(this, args);
      traceCall(`window.CSSStyleSheet.prototype.${name}`, "CSSStyleSheet", args, result);
      return result;
    },
  }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}
