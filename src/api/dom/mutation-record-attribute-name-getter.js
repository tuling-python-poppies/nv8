import { traceGetter } from "../../trace/trace-accessor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { requireMutationRecord } from "./mutation-record-state.js";

export const attributeName = Object.getOwnPropertyDescriptor({
  get attributeName() {
    const value = requireMutationRecord(this).attributeName;
    traceGetter("window.MutationRecord.prototype.attributeName", "MutationRecord", value);
    return value;
  },
}, "attributeName").get;
registerNativeGetter(attributeName, "attributeName");
