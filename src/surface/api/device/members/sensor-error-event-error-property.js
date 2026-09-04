import * as runtime from "../device-runtime.js";
import { SensorErrorEvent } from "../device-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    SensorErrorEvent,
    "error",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}
