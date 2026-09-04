import * as runtime from "../device-runtime.js";
import { Sensor } from "../device-runtime.js";
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
  installDispatchedGlobal(Sensor);
}

export function installRelation() {
  installDispatchedRelation(
    Sensor,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    Sensor,
    "activated",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    Sensor,
    "hasReading",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    Sensor,
    "timestamp",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    Sensor,
    "onerror",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    true,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    Sensor,
    "onreading",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    true,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    Sensor,
    "onactivate",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    true,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    Sensor,
    "start",
    0,
    runtime.deviceOperation,
  );
}

export function installOwnedMember7() {
  installDispatchedMethod(
    Sensor,
    "stop",
    0,
    runtime.deviceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(Sensor);
}

export function installTag() {
  installDispatchedTag(Sensor);
}
