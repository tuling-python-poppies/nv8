import * as runtime from "../device-runtime.js";
import { Gyroscope } from "../device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(Gyroscope);
}

export function installRelation() {
  installDispatchedRelation(
    Gyroscope,
    "Sensor",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    Gyroscope,
    "x",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    Gyroscope,
    "y",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    Gyroscope,
    "z",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(Gyroscope);
}

export function installTag() {
  installDispatchedTag(Gyroscope);
}
