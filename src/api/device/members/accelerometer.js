import * as runtime from "../device-runtime.js";
import { Accelerometer } from "../device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(Accelerometer);
}

export function installRelation() {
  installDispatchedRelation(
    Accelerometer,
    "Sensor",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    Accelerometer,
    "x",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    Accelerometer,
    "y",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    Accelerometer,
    "z",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(Accelerometer);
}

export function installTag() {
  installDispatchedTag(Accelerometer);
}
