import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { getAttributeValue } from "./element-state.js";

export const className = Object.getOwnPropertyDescriptor({
  get className() {
    const value = getAttributeValue(this, "class") ?? "";
    traceGetter("window.Element.prototype.className", "Element", value);
    return value;
  },
}, "className").get;
registerNativeGetter(className, "className");
