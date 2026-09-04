import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { requireCSSImportRule } from "./css-import-rule-state.js";

export function cssImportRuleGetter(name, read) {
  const getter = {
    [`get ${name}`]() {
      const result = read(requireCSSImportRule(this));
      traceCall(`window.CSSImportRule.prototype.${name}`, "CSSImportRule", [], result);
      return result;
    },
  }[`get ${name}`];
  registerNativeFunction(getter, `get ${name}`);
  return getter;
}
