import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { conditionTextFor } from "./css-condition-rule-state.js";

export function conditionText() {
  const result = conditionTextFor(this);
  traceCall(
    "window.CSSConditionRule.prototype.conditionText",
    "CSSConditionRule",
    [],
    result,
  );
  return result;
}
registerNativeGetter(conditionText, "conditionText");
