import * as runtime from "../device-runtime.js";
import { DeviceMotionEvent } from "../device-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(DeviceMotionEvent);
}

export function installRelation() {
  installDispatchedRelation(
    DeviceMotionEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(DeviceMotionEvent);
}

export function installTag() {
  installDispatchedTag(DeviceMotionEvent);
}
