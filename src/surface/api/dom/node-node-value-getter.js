import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { nodeValueValue } from "./node-getters.js";

export const nodeValue = Object.getOwnPropertyDescriptor({
  get nodeValue() {
    const value = nodeValueValue(this);
    traceGetter("window.Node.prototype.nodeValue", "Node", value);
    return value;
  },
}, "nodeValue").get;
registerNativeGetter(nodeValue, "nodeValue");
