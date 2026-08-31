import * as runtime from "../external-device-runtime.js";
import { HIDConnectionEvent } from "../external-device-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(HIDConnectionEvent);
}

export function installRelation() {
  installDispatchedRelation(
    HIDConnectionEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(HIDConnectionEvent);
}

export function installTag() {
  installDispatchedTag(HIDConnectionEvent);
}
