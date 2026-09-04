import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireElement } from "./element-state.js";
import { serializeNode } from "./html-serializer.js";

export const outerHTML = Object.getOwnPropertyDescriptor({
  get outerHTML() {
    requireElement(this);
    const value = serializeNode(this);
    traceGetter("window.Element.prototype.outerHTML", "Element", value);
    return value;
  },
}, "outerHTML").get;
registerNativeGetter(outerHTML, "outerHTML");
