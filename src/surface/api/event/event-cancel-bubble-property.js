import { definePrototypeAccessor } from "../../../engine/webidl/descriptor.js";
import { Event } from "./event-constructor.js";
import { eventCancelBubble as getter } from "./event-cancel-bubble-getter.js";
import { eventCancelBubble as setter } from "./event-cancel-bubble-setter.js";

export function installEventCancelBubble() {
  definePrototypeAccessor(Event.prototype, "cancelBubble", getter, setter);
}
