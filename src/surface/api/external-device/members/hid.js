import * as runtime from "../external-device-runtime.js";
import { HID } from "../external-device-runtime.js";
import { EventTarget as __ExplicitParent } from "../../event/event-target-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(HID);
}

export function installRelation() {
  installDispatchedRelation(
    HID,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    HID,
    "onconnect",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    HID,
    "ondisconnect",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    true,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    HID,
    "getDevices",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(HID);
}

export function installOwnedMember3() {
  installDispatchedMethod(
    HID,
    "requestDevice",
    1,
    runtime.externalDeviceOperation,
  );
}

export function installTag() {
  installDispatchedTag(HID);
}
