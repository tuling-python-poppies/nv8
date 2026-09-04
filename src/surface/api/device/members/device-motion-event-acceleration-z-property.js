import * as runtime from "../device-runtime.js";
import { DeviceMotionEventAcceleration } from "../device-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    DeviceMotionEventAcceleration,
    "z",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}
