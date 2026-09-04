import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { requireNode } from "./node-state.js";
import {
  requireProcessingInstruction,
} from "./processing-instruction-constructor.js";

export const target = Object.getOwnPropertyDescriptor({
  get target() {
    requireProcessingInstruction(this);
    const result = requireNode(this).nodeName;
    traceGetter(
      "window.ProcessingInstruction.prototype.target",
      "ProcessingInstruction",
      result,
    );
    return result;
  },
}, "target").get;
registerNativeGetter(target, "target");
