import * as runtime from "../device-runtime.js";
import { DeviceMotionEventRotationRate } from "../device-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    DeviceMotionEventRotationRate,
    "alpha",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}
