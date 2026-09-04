import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { NavigatorUAData } from "./navigator-ua-data-constructor.js";
import {
  highEntropyUaData,
  requireNavigatorUAData,
} from "./navigator-ua-data-state.js";

export const getHighEntropyValues = {
  getHighEntropyValues(hints) {
    requireNavigatorUAData(this);
    if (arguments.length === 0) {
      throw new TypeError(
        "Failed to execute 'getHighEntropyValues' on 'NavigatorUAData': 1 argument required.",
      );
    }
    if (hints === null || hints === undefined) {
      throw new TypeError("The hints must be a sequence");
    }
    const result = Promise.resolve(highEntropyUaData(Array.from(hints)));
    traceCall(
      "window.NavigatorUAData.prototype.getHighEntropyValues",
      "NavigatorUAData",
      [hints],
      result,
    );
    return result;
  },
}.getHighEntropyValues;
registerNativeFunction(getHighEntropyValues, "getHighEntropyValues");
export function installNavigatorUADataHighEntropy() {
  definePrototypeMethod(
    NavigatorUAData.prototype,
    "getHighEntropyValues",
    getHighEntropyValues,
  );
}
