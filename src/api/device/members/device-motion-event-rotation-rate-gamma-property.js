import * as runtime from "../device-runtime.js";
import { DeviceMotionEventRotationRate } from "../device-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    DeviceMotionEventRotationRate,
    "gamma",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}
