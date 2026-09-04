import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireMutationRecord } from "./mutation-record-state.js";

export const oldValue = Object.getOwnPropertyDescriptor({
  get oldValue() {
    const value = requireMutationRecord(this).oldValue;
    traceGetter("window.MutationRecord.prototype.oldValue", "MutationRecord", value);
    return value;
  },
}, "oldValue").get;
registerNativeGetter(oldValue, "oldValue");
