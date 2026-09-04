import * as runtime from "../external-device-runtime.js";
import { HIDInputReportEvent } from "../external-device-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(HIDInputReportEvent);
}

export function installRelation() {
  installDispatchedRelation(
    HIDInputReportEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(HIDInputReportEvent);
}

export function installTag() {
  installDispatchedTag(HIDInputReportEvent);
}
