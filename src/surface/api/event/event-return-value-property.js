import { definePrototypeAccessor } from "../../../engine/webidl/descriptor.js";
import { Event } from "./event-constructor.js";
import { eventReturnValue as getter } from "./event-return-value-getter.js";
import { eventReturnValue as setter } from "./event-return-value-setter.js";

export function installEventReturnValue() {
  definePrototypeAccessor(Event.prototype, "returnValue", getter, setter);
}
