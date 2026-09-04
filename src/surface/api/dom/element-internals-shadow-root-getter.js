import { elementInternalsReadonlyDescriptor } from "./element-internals-property.js";
import { internalsShadowRoot } from "./element-internals-state.js";
export const shadowRoot = elementInternalsReadonlyDescriptor("shadowRoot", internalsShadowRoot).get;
