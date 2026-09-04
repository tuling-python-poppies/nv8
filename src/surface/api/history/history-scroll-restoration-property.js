import { definePrototypeAccessor } from "../../../engine/webidl/descriptor.js";
import { History } from "./history-constructor.js";
import {
  scrollRestoration as getter,
} from "./history-scroll-restoration-getter.js";
import {
  scrollRestoration as setter,
} from "./history-scroll-restoration-setter.js";

export function installHistoryScrollRestoration() {
  definePrototypeAccessor(
    History.prototype,
    "scrollRestoration",
    getter,
    setter,
  );
}
