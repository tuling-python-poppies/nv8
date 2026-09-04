import { traceGetter } from "../../../infra/trace/trace-accessor.js";
import { definePrototypeGetter } from "../../../engine/webidl/descriptor.js";
import { registerNativeGetter } from "../../../engine/webidl/native-function.js";
import { NavigatorUAData } from "./navigator-ua-data-constructor.js";
import {
  lowEntropyUaData,
  requireNavigatorUAData,
} from "./navigator-ua-data-state.js";

export const brands = Object.getOwnPropertyDescriptor({
  get brands() {
    requireNavigatorUAData(this);
    const value = lowEntropyUaData().brands;
    traceGetter("window.NavigatorUAData.prototype.brands", "NavigatorUAData", value);
    return value;
  },
}, "brands").get;
registerNativeGetter(brands, "brands");
export function installNavigatorUADataBrands() {
  definePrototypeGetter(NavigatorUAData.prototype, "brands", brands);
}
