import { traceCall } from "../../../infra/trace/trace-function.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
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
