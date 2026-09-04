import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireMutationRecord } from "./mutation-record-state.js";

export const previousSibling = Object.getOwnPropertyDescriptor({
  get previousSibling() {
    const value = requireMutationRecord(this).previousSibling;
    traceGetter("window.MutationRecord.prototype.previousSibling", "MutationRecord", value);
    return value;
  },
}, "previousSibling").get;
registerNativeGetter(previousSibling, "previousSibling");
