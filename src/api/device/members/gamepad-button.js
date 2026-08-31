import * as runtime from "../device-runtime.js";
import { GamepadButton } from "../device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(GamepadButton);
}

export function installRelation() {
  installDispatchedRelation(
    GamepadButton,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    GamepadButton,
    "pressed",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    GamepadButton,
    "touched",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    GamepadButton,
    "value",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(GamepadButton);
}

export function installTag() {
  installDispatchedTag(GamepadButton);
}
