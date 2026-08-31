import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const sendBeacon = {
  sendBeacon(url) {
    requireNavigator(this);
    if (arguments.length === 0) {
      throw new TypeError(
        "Failed to execute 'sendBeacon' on 'Navigator': 1 argument required.",
      );
    }
    const address = `${url}`;
    if (!/^https?:\/\//iu.test(address)) {
      throw new TypeError("Beacons are only supported over HTTP(S)");
    }
    traceCall(
      "window.Navigator.prototype.sendBeacon",
      "Navigator",
      [address, arguments[1]],
      false,
    );
    return false;
  },
}.sendBeacon;
registerNativeFunction(sendBeacon, "sendBeacon");
export function installNavigatorSendBeacon() {
  definePrototypeMethod(Navigator.prototype, "sendBeacon", sendBeacon);
}
