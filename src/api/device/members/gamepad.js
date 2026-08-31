import * as runtime from "../device-runtime.js";
import { Gamepad } from "../device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(Gamepad);
}

export function installRelation() {
  installDispatchedRelation(
    Gamepad,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    Gamepad,
    "id",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    Gamepad,
    "index",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    Gamepad,
    "connected",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    Gamepad,
    "timestamp",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    Gamepad,
    "mapping",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    Gamepad,
    "axes",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember6() {
  installDispatchedAccessor(
    Gamepad,
    "buttons",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember7() {
  installDispatchedAccessor(
    Gamepad,
    "vibrationActuator",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(Gamepad);
}

export function installTag() {
  installDispatchedTag(Gamepad);
}
