import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { readCSSDeclarations } from "./css-style-declaration-state.js";

export function values() {
  const result = [...readCSSDeclarations(this).keys()].values();
  traceCall("window.CSSStyleDeclaration.prototype.Symbol(Symbol.iterator)", "CSSStyleDeclaration", [], result);
  return result;
}
registerNativeFunction(values, "values");
