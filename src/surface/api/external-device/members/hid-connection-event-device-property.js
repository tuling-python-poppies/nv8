import * as runtime from "../external-device-runtime.js";
import { HIDConnectionEvent } from "../external-device-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    HIDConnectionEvent,
    "device",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}
