import * as runtime from "../external-device-runtime.js";
import { USBConnectionEvent } from "../external-device-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    USBConnectionEvent,
    "device",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}
