import * as runtime from "../external-device-runtime.js";
import { Bluetooth } from "../external-device-runtime.js";
import { EventTarget as __ExplicitParent } from "../../event/event-target-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(Bluetooth);
}

export function installRelation() {
  installDispatchedRelation(
    Bluetooth,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedMethod(
    Bluetooth,
    "getAvailability",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    Bluetooth,
    "requestDevice",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(Bluetooth);
}

export function installTag() {
  installDispatchedTag(Bluetooth);
}
