import * as runtime from "../device-runtime.js";
import { DeviceMotionEventAcceleration } from "../device-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    DeviceMotionEventAcceleration,
    "y",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}
