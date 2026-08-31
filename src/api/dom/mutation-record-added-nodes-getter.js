import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireMutationRecord } from "./mutation-record-state.js";

export const addedNodes = Object.getOwnPropertyDescriptor({
  get addedNodes() {
    const value = requireMutationRecord(this).addedNodes;
    traceGetter("window.MutationRecord.prototype.addedNodes", "MutationRecord", value);
    return value;
  },
}, "addedNodes").get;
registerNativeGetter(addedNodes, "addedNodes");
