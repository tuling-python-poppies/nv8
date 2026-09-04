import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { getAttributeValue } from "./element-state.js";

export const id = Object.getOwnPropertyDescriptor({
  get id() {
    const value = getAttributeValue(this, "id") ?? "";
    traceGetter("window.Element.prototype.id", "Element", value);
    return value;
  },
}, "id").get;
registerNativeGetter(id, "id");
