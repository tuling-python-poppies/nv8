import * as runtime from "../device-runtime.js";
import { DeviceMotionEvent } from "../device-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    DeviceMotionEvent,
    "interval",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}
