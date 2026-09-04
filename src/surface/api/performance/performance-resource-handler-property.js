import { definePrototypeAccessor } from "../../../engine/webidl/descriptor.js";
import { Performance } from "./performance-constructor.js";
import {
  performanceResourceHandler as getter,
} from "./performance-resource-handler-getter.js";
import {
  performanceResourceHandler as setter,
} from "./performance-resource-handler-setter.js";

export function installPerformanceResourceHandler() {
  definePrototypeAccessor(
    Performance.prototype,
    "onresourcetimingbufferfull",
    getter,
    setter,
  );
}
