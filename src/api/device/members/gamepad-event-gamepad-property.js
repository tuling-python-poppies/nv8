import * as runtime from "../device-runtime.js";
import { GamepadEvent } from "../device-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    GamepadEvent,
    "gamepad",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}
