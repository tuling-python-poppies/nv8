import * as runtime from "../device-runtime.js";
import { DeviceMotionEvent } from "../device-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    DeviceMotionEvent,
    "rotationRate",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}
