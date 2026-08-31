import * as runtime from "../device-runtime.js";
import { DeviceOrientationEvent } from "../device-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    DeviceOrientationEvent,
    "absolute",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}
