import { traceCall } from "../../../infra/trace/trace-function.js";
import { definePrototypeMethod } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const adAuctionComponents = {
  adAuctionComponents(count) {
    requireNavigator(this);
    if (arguments.length === 0) {
      throw new TypeError("adAuctionComponents requires a count");
    }
    const length = Math.max(0, Math.min(20, Math.trunc(Number(count)) || 0));
    const value = new Array(length).fill("urn:uuid:00000000-0000-4000-8000-000000000001");
    traceCall("window.Navigator.prototype.adAuctionComponents", "Navigator", [count], value);
    return value;
  },
}.adAuctionComponents;
registerNativeFunction(adAuctionComponents, "adAuctionComponents");
export function installNavigatorAdAuctionComponents() {
  definePrototypeMethod(Navigator.prototype, "adAuctionComponents", adAuctionComponents);
}
