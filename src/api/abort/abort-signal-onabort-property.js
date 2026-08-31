import { definePrototypeAccessor } from "../../webidl/descriptor.js";
import { AbortSignal } from "./abort-signal-constructor.js";
import { onabort as getter } from "./abort-signal-onabort-getter.js";
import { onabort as setter } from "./abort-signal-onabort-setter.js";

export function installAbortSignalOnabort() {
  definePrototypeAccessor(AbortSignal.prototype, "onabort", getter, setter);
}
