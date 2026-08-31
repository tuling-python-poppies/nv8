import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { replaceWithAlgorithm } from "./character-data-algorithms.js";

export const replaceWith = {
  replaceWith(...values) {
    replaceWithAlgorithm(this, values);
    traceCall("window.DocumentType.prototype.replaceWith", "DocumentType", values, undefined);
  },
}.replaceWith;
registerNativeFunction(replaceWith, "replaceWith");
