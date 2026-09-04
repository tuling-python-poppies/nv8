import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { setShadowHTML } from "./shadow-root-set-html-algorithm.js";

export const setHTML = {
  setHTML(html) {
    setShadowHTML(this, html);
    traceCall(
      "window.ShadowRoot.prototype.setHTML",
      "ShadowRoot",
      [html, arguments[1]],
      undefined,
    );
  },
}.setHTML;
registerNativeFunction(setHTML, "setHTML");
