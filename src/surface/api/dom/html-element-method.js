import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireHTMLElement } from "./html-element-state.js";
export function htmlElementMethod(name, arity, operation) {
  const callback = { [name](...args) {
    requireHTMLElement(this);
    const result = operation(this, args);
    traceCall(`window.HTMLElement.prototype.${name}`, "HTMLElement", args, result);
    return result;
  } }[name];
  Object.defineProperty(callback, "length", { value: arity, configurable: true });
  registerNativeFunction(callback, name);
  return callback;
}
