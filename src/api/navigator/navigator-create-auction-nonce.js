import { traceCall } from "../../trace/trace-function.js";
import { definePrototypeMethod } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const createAuctionNonce = {
  createAuctionNonce() {
    requireNavigator(this);
    const value = Promise.resolve("00000000-0000-4000-8000-000000000001");
    traceCall(
      "window.Navigator.prototype.createAuctionNonce",
      "Navigator",
      [],
      value,
    );
    return value;
  },
}.createAuctionNonce;
registerNativeFunction(createAuctionNonce, "createAuctionNonce");
export function installNavigatorCreateAuctionNonce() {
  definePrototypeMethod(Navigator.prototype, "createAuctionNonce", createAuctionNonce);
}
