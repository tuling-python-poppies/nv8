import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireMutationRecord } from "./mutation-record-state.js";

export const nextSibling = Object.getOwnPropertyDescriptor({
  get nextSibling() {
    const value = requireMutationRecord(this).nextSibling;
    traceGetter("window.MutationRecord.prototype.nextSibling", "MutationRecord", value);
    return value;
  },
}, "nextSibling").get;
registerNativeGetter(nextSibling, "nextSibling");
