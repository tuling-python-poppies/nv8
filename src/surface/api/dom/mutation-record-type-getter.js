import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireMutationRecord } from "./mutation-record-state.js";

export const type = Object.getOwnPropertyDescriptor({
  get type() {
    const value = requireMutationRecord(this).type;
    traceGetter("window.MutationRecord.prototype.type", "MutationRecord", value);
    return value;
  },
}, "type").get;
registerNativeGetter(type, "type");
