import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const canLoadAdAuctionFencedFrame = {
  canLoadAdAuctionFencedFrame() {
    requireNavigator(this);
    const value = Promise.resolve(false);
    traceCall(
      "window.Navigator.prototype.canLoadAdAuctionFencedFrame",
      "Navigator",
      arguments.length === 0 ? [] : [arguments[0]],
      value,
    );
    return value;
  },
}.canLoadAdAuctionFencedFrame;
registerNativeFunction(canLoadAdAuctionFencedFrame, "canLoadAdAuctionFencedFrame");
export function installNavigatorCanLoadAdAuctionFencedFrame() {
  definePrototypeMethod(
    Navigator.prototype,
    "canLoadAdAuctionFencedFrame",
    canLoadAdAuctionFencedFrame,
  );
}
