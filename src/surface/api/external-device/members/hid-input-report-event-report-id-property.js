import * as runtime from "../external-device-runtime.js";
import { HIDInputReportEvent } from "../external-device-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    HIDInputReportEvent,
    "reportId",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}
