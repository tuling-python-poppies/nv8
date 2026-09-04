import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { textContentValue } from "./node-getters.js";

export const textContent = Object.getOwnPropertyDescriptor({
  get textContent() {
    const value = textContentValue(this);
    traceGetter("window.Node.prototype.textContent", "Node", value);
    return value;
  },
}, "textContent").get;
registerNativeGetter(textContent, "textContent");
