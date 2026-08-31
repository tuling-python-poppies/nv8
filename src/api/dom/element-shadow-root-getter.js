import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Element } from "./element-constructor.js";
import { requireElement } from "./element-state.js";
import { exposedShadowRoot } from "./shadow-root-state.js";

export const shadowRoot = Object.getOwnPropertyDescriptor({
  get shadowRoot() {
    requireElement(this);
    const result = exposedShadowRoot(this);
    traceGetter(
      "window.Element.prototype.shadowRoot",
      "Element",
      result,
    );
    return result;
  },
}, "shadowRoot").get;
registerNativeGetter(shadowRoot, "shadowRoot");

export function installElementShadowRoot() {
  definePrototypeGetter(Element.prototype, "shadowRoot", shadowRoot);
}
