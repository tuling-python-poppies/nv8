import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { detachNodeIterator } from "./node-iterator-state.js";

export const detach = {
  detach() {
    detachNodeIterator(this);
    traceCall(
      "window.NodeIterator.prototype.detach",
      "NodeIterator",
      [],
      undefined,
    );
  },
}.detach;
registerNativeFunction(detach, "detach");
