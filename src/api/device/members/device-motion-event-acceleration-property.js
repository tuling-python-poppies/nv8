import * as runtime from "../device-runtime.js";
import { DeviceMotionEvent } from "../device-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    DeviceMotionEvent,
    "acceleration",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}
