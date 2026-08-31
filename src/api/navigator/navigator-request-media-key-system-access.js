import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";
import {
  requestMediaKeySystemAccess as requestAccess,
} from "../media-agency/media-agency-runtime.js";

export const requestMediaKeySystemAccess = {
  requestMediaKeySystemAccess(keySystem, configurations) {
    requireNavigator(this);
    if (arguments.length < 2) {
      throw new TypeError(
        "requestMediaKeySystemAccess requires a key system and configurations.",
      );
    }
    const normalized = `${keySystem}`;
    const value = requestAccess(normalized, configurations);
    traceCall(
      "window.Navigator.prototype.requestMediaKeySystemAccess",
      "Navigator",
      [normalized, configurations],
      value,
    );
    return value;
  },
}.requestMediaKeySystemAccess;
registerNativeFunction(
  requestMediaKeySystemAccess,
  "requestMediaKeySystemAccess",
);
export function installNavigatorRequestMediaKeySystemAccess() {
  definePrototypeMethod(
    Navigator.prototype,
    "requestMediaKeySystemAccess",
    requestMediaKeySystemAccess,
  );
}
