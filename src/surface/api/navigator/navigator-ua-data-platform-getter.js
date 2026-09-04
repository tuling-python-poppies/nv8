import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { NavigatorUAData } from "./navigator-ua-data-constructor.js";
import {
  lowEntropyUaData,
  requireNavigatorUAData,
} from "./navigator-ua-data-state.js";

export const platform = Object.getOwnPropertyDescriptor({
  get platform() {
    requireNavigatorUAData(this);
    const value = lowEntropyUaData().platform;
    traceGetter("window.NavigatorUAData.prototype.platform", "NavigatorUAData", value);
    return value;
  },
}, "platform").get;
registerNativeGetter(platform, "platform");
export function installNavigatorUADataPlatform() {
  definePrototypeGetter(NavigatorUAData.prototype, "platform", platform);
}
