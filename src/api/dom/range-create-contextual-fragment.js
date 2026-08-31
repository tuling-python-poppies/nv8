import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { createContextualFragmentAlgorithm } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

export const createContextualFragment = {
  createContextualFragment(fragment) {
    const result = createContextualFragmentAlgorithm(this, fragment);
    traceCall(
      "window.Range.prototype.createContextualFragment",
      "Range",
      [fragment],
      result,
    );
    return result;
  },
}.createContextualFragment;
registerNativeFunction(createContextualFragment, "createContextualFragment");
export function installRangeCreateContextualFragment() {
  definePrototypeMethod(
    Range.prototype,
    "createContextualFragment",
    createContextualFragment,
  );
}
