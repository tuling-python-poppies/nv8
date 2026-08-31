import { traceCall } from "../../trace/trace-function.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireCSSMediaRule } from "./css-media-rule-state.js";

export function media() {
  const result = requireCSSMediaRule(this).media;
  traceCall("window.CSSMediaRule.prototype.media", "CSSMediaRule", [], result);
  return result;
}
registerNativeGetter(media, "media");
