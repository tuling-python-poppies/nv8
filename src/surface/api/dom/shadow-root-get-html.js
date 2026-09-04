import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { serializeChildren } from "./html-serializer.js";
import { requireShadowRoot } from "./shadow-root-state.js";

export const getHTML = {
  getHTML() {
    requireShadowRoot(this);
    const result = serializeChildren(this);
    traceCall(
      "window.ShadowRoot.prototype.getHTML",
      "ShadowRoot",
      [arguments[0]],
      result,
    );
    return result;
  },
}.getHTML;
registerNativeFunction(getHTML, "getHTML");
