import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireShadowRoot } from "./shadow-root-state.js";

const emptyStyleSheets = [];

export const styleSheets = Object.getOwnPropertyDescriptor({
  get styleSheets() {
    requireShadowRoot(this);
    traceGetter(
      "window.ShadowRoot.prototype.styleSheets",
      "ShadowRoot",
      emptyStyleSheets,
    );
    return emptyStyleSheets;
  },
}, "styleSheets").get;
registerNativeGetter(styleSheets, "styleSheets");
