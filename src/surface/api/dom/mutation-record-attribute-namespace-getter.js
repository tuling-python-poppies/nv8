import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireMutationRecord } from "./mutation-record-state.js";

export const attributeNamespace = Object.getOwnPropertyDescriptor({
  get attributeNamespace() {
    const value = requireMutationRecord(this).attributeNamespace;
    traceGetter(
      "window.MutationRecord.prototype.attributeNamespace",
      "MutationRecord",
      value,
    );
    return value;
  },
}, "attributeNamespace").get;
registerNativeGetter(attributeNamespace, "attributeNamespace");
