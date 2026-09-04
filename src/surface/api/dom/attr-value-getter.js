import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { attrValue, requireAttr } from "./attr-state.js";

export const value = Object.getOwnPropertyDescriptor({
  get value() {
    requireAttr(this);
    const result = attrValue(this);
    traceGetter("window.Attr.prototype.value", "Attr", result);
    return result;
  },
}, "value").get;
registerNativeGetter(value, "value");
