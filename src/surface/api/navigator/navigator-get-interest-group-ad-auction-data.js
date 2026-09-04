import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const getInterestGroupAdAuctionData = {
  getInterestGroupAdAuctionData(configuration) {
    requireNavigator(this);
    if (arguments.length === 0) {
      throw new TypeError("A configuration is required");
    }
    const result = {
      requestId: "edge-sandbox-request",
      request: new ArrayBuffer(0),
    };
    const value = Promise.resolve(result);
    traceCall(
      "window.Navigator.prototype.getInterestGroupAdAuctionData",
      "Navigator",
      [configuration],
      value,
    );
    return value;
  },
}.getInterestGroupAdAuctionData;
registerNativeFunction(
  getInterestGroupAdAuctionData,
  "getInterestGroupAdAuctionData",
);
export function installNavigatorGetInterestGroupAdAuctionData() {
  definePrototypeMethod(
    Navigator.prototype,
    "getInterestGroupAdAuctionData",
    getInterestGroupAdAuctionData,
  );
}
