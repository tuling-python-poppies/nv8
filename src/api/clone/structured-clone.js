import { traceCall } from "../../trace/trace-function.js";
import { defineGlobalFunction } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import {
  performStructuredClone,
} from "./structured-clone-algorithm.js";

export const structuredClone = {
  structuredClone(value) {
    if (arguments.length === 0) {
      throw new TypeError("Failed to execute 'structuredClone': 1 argument required.");
    }
    const options = arguments[1];
    const result = performStructuredClone(value, options);
    traceCall(
      "window.structuredClone",
      "Window",
      arguments.length === 1 ? [value] : [value, options],
      result,
    );
    return result;
  },
}.structuredClone;

registerNativeFunction(structuredClone, "structuredClone");

export function installStructuredClone() {
  defineGlobalFunction("structuredClone", structuredClone);
}
