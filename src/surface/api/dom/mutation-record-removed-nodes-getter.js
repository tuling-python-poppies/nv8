import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireMutationRecord } from "./mutation-record-state.js";

export const removedNodes = Object.getOwnPropertyDescriptor({
  get removedNodes() {
    const value = requireMutationRecord(this).removedNodes;
    traceGetter("window.MutationRecord.prototype.removedNodes", "MutationRecord", value);
    return value;
  },
}, "removedNodes").get;
registerNativeGetter(removedNodes, "removedNodes");
