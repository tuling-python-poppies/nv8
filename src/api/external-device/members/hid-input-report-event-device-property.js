import * as runtime from "../external-device-runtime.js";
import { HIDInputReportEvent } from "../external-device-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    HIDInputReportEvent,
    "device",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}
