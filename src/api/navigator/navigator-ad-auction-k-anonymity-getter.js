import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { requireNavigator } from "./navigator-state.js";

export const deprecatedRunAdAuctionEnforcesKAnonymity =
  Object.getOwnPropertyDescriptor({
    get deprecatedRunAdAuctionEnforcesKAnonymity() {
      requireNavigator(this);
      const value = true;
      traceGetter(
        "window.Navigator.prototype.deprecatedRunAdAuctionEnforcesKAnonymity",
        "Navigator",
        value,
      );
      return value;
    },
  }, "deprecatedRunAdAuctionEnforcesKAnonymity").get;
registerNativeGetter(
  deprecatedRunAdAuctionEnforcesKAnonymity,
  "deprecatedRunAdAuctionEnforcesKAnonymity",
);
export function installNavigatorAdAuctionKAnonymity() {
  definePrototypeGetter(
    Navigator.prototype,
    "deprecatedRunAdAuctionEnforcesKAnonymity",
    deprecatedRunAdAuctionEnforcesKAnonymity,
  );
}
