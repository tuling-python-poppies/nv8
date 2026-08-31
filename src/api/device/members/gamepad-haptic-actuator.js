import * as runtime from "../device-runtime.js";
import { GamepadHapticActuator } from "../device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(GamepadHapticActuator);
}

export function installRelation() {
  installDispatchedRelation(
    GamepadHapticActuator,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    GamepadHapticActuator,
    "effects",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    GamepadHapticActuator,
    "type",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    GamepadHapticActuator,
    "playEffect",
    2,
    runtime.deviceOperation,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    GamepadHapticActuator,
    "reset",
    0,
    runtime.deviceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(GamepadHapticActuator);
}

export function installTag() {
  installDispatchedTag(GamepadHapticActuator);
}
