import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { NavigatorUAData } from "./navigator-ua-data-constructor.js";
import {
  lowEntropyUaData,
  requireNavigatorUAData,
} from "./navigator-ua-data-state.js";

export const mobile = Object.getOwnPropertyDescriptor({
  get mobile() {
    requireNavigatorUAData(this);
    const value = lowEntropyUaData().mobile;
    traceGetter("window.NavigatorUAData.prototype.mobile", "NavigatorUAData", value);
    return value;
  },
}, "mobile").get;
registerNativeGetter(mobile, "mobile");
export function installNavigatorUADataMobile() {
  definePrototypeGetter(NavigatorUAData.prototype, "mobile", mobile);
}
