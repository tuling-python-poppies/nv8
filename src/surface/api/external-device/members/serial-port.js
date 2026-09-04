import * as runtime from "../external-device-runtime.js";
import { SerialPort } from "../external-device-runtime.js";
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
  installDispatchedGlobal(SerialPort);
}

export function installRelation() {
  installDispatchedRelation(
    SerialPort,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    SerialPort,
    "onconnect",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    SerialPort,
    "ondisconnect",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    true,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    SerialPort,
    "readable",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    SerialPort,
    "writable",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    SerialPort,
    "close",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember5() {
  installDispatchedMethod(
    SerialPort,
    "forget",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    SerialPort,
    "getInfo",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember7() {
  installDispatchedMethod(
    SerialPort,
    "getSignals",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember8() {
  installDispatchedMethod(
    SerialPort,
    "open",
    1,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember9() {
  installDispatchedMethod(
    SerialPort,
    "setSignals",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember10() {
  installDispatchedAccessor(
    SerialPort,
    "connected",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(SerialPort);
}

export function installTag() {
  installDispatchedTag(SerialPort);
}
