import * as runtime from "../navigator-services-runtime.js";
import { DevicePosture } from "../navigator-services-runtime.js";
import { EventTarget as __ExplicitParent } from "../../event/event-target-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(DevicePosture);
}

export function installRelation() {
  installDispatchedRelation(
    DevicePosture,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    DevicePosture,
    "type",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    DevicePosture,
    "onchange",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    true,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(DevicePosture);
}

export function installTag() {
  installDispatchedTag(DevicePosture);
}
