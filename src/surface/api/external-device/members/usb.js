import * as runtime from "../external-device-runtime.js";
import { USB } from "../external-device-runtime.js";
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
  installDispatchedGlobal(USB);
}

export function installRelation() {
  installDispatchedRelation(
    USB,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    USB,
    "onconnect",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    USB,
    "ondisconnect",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    true,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    USB,
    "getDevices",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(USB);
}

export function installOwnedMember3() {
  installDispatchedMethod(
    USB,
    "requestDevice",
    1,
    runtime.externalDeviceOperation,
  );
}

export function installTag() {
  installDispatchedTag(USB);
}
