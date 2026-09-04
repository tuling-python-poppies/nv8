import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireMutationRecord } from "./mutation-record-state.js";

export const target = Object.getOwnPropertyDescriptor({
  get target() {
    const value = requireMutationRecord(this).target;
    traceGetter("window.MutationRecord.prototype.target", "MutationRecord", value);
    return value;
  },
}, "target").get;
registerNativeGetter(target, "target");
