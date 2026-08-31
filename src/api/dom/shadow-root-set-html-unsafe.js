import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { setShadowHTML } from "./shadow-root-set-html-algorithm.js";

export const setHTMLUnsafe = {
  setHTMLUnsafe(html) {
    setShadowHTML(this, html);
    traceCall(
      "window.ShadowRoot.prototype.setHTMLUnsafe",
      "ShadowRoot",
      [html],
      undefined,
    );
  },
}.setHTMLUnsafe;
registerNativeFunction(setHTMLUnsafe, "setHTMLUnsafe");
