import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { Navigator } from "./navigator-constructor.js";
import { navigatorService } from "./navigator-state.js";

export const geolocation = Object.getOwnPropertyDescriptor({
  get geolocation() {
    const value = navigatorService(this, "geolocation");
    traceGetter("window.Navigator.prototype.geolocation", "Navigator", value);
    return value;
  },
}, "geolocation").get;
registerNativeGetter(geolocation, "geolocation");
export function installNavigatorGeolocation() {
  definePrototypeGetter(Navigator.prototype, "geolocation", geolocation);
}
