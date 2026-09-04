import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeFunction, registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireShadowRoot } from "./shadow-root-state.js";

const descriptor = Object.getOwnPropertyDescriptor({
  get adoptedStyleSheets() {
    const result = requireShadowRoot(this).adoptedStyleSheets;
    traceGetter(
      "window.ShadowRoot.prototype.adoptedStyleSheets",
      "ShadowRoot",
      result,
    );
    return result;
  },
  set adoptedStyleSheets(value) {
    const state = requireShadowRoot(this);
    if (value === null || value === undefined || value[Symbol.iterator] === undefined) {
      throw new TypeError("adoptedStyleSheets must be iterable.");
    }
    state.adoptedStyleSheets = Array.from(value);
  },
}, "adoptedStyleSheets");

export const adoptedStyleSheets = descriptor.get;
export const setAdoptedStyleSheets = descriptor.set;
registerNativeGetter(adoptedStyleSheets, "adoptedStyleSheets");
registerNativeFunction(setAdoptedStyleSheets, "set adoptedStyleSheets");
