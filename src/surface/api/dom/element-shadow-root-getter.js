import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
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
