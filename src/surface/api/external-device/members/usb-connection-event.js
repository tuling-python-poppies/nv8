import * as runtime from "../external-device-runtime.js";
import { USBConnectionEvent } from "../external-device-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(USBConnectionEvent);
}

export function installRelation() {
  installDispatchedRelation(
    USBConnectionEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(USBConnectionEvent);
}

export function installTag() {
  installDispatchedTag(USBConnectionEvent);
}
