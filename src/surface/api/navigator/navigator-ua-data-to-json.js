import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { NavigatorUAData } from "./navigator-ua-data-constructor.js";
import {
  lowEntropyUaData,
  requireNavigatorUAData,
} from "./navigator-ua-data-state.js";

export const toJSON = {
  toJSON() {
    requireNavigatorUAData(this);
    const value = lowEntropyUaData();
    traceCall(
      "window.NavigatorUAData.prototype.toJSON",
      "NavigatorUAData",
      [],
      value,
    );
    return value;
  },
}.toJSON;
registerNativeFunction(toJSON, "toJSON");
export function installNavigatorUADataToJSON() {
  definePrototypeMethod(NavigatorUAData.prototype, "toJSON", toJSON);
}
