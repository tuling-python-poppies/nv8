import { traceCall } from "../../trace/trace-function.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { removeAlgorithm } from "./character-data-algorithms.js";

export const remove = {
  remove() {
    removeAlgorithm(this);
    traceCall("window.DocumentType.prototype.remove", "DocumentType", [], undefined);
  },
}.remove;
registerNativeFunction(remove, "remove");
