import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireMutationRecord } from "./mutation-record-state.js";

export const addedNodes = Object.getOwnPropertyDescriptor({
  get addedNodes() {
    const value = requireMutationRecord(this).addedNodes;
    traceGetter("window.MutationRecord.prototype.addedNodes", "MutationRecord", value);
    return value;
  },
}, "addedNodes").get;
registerNativeGetter(addedNodes, "addedNodes");
