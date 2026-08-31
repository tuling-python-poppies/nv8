import * as runtime from "../device-runtime.js";
import { DeviceOrientationEvent } from "../device-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(DeviceOrientationEvent);
}

export function installRelation() {
  installDispatchedRelation(
    DeviceOrientationEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(DeviceOrientationEvent);
}

export function installTag() {
  installDispatchedTag(DeviceOrientationEvent);
}
