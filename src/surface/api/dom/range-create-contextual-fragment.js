import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { createContextualFragmentAlgorithm } from "./range-algorithms.js";
import { Range } from "./range-constructor.js";

const createContextualFragment = {
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
