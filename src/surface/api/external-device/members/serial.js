import * as runtime from "../external-device-runtime.js";
import { Serial } from "../external-device-runtime.js";
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
  installDispatchedGlobal(Serial);
}

export function installRelation() {
  installDispatchedRelation(
    Serial,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    Serial,
    "onconnect",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    Serial,
    "ondisconnect",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    true,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    Serial,
    "getPorts",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(Serial);
}

export function installOwnedMember3() {
  installDispatchedMethod(
    Serial,
    "requestPort",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installTag() {
  installDispatchedTag(Serial);
}
