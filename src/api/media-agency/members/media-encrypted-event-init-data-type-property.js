import * as runtime from "../media-agency-runtime.js";
import { MediaEncryptedEvent } from "../media-agency-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    MediaEncryptedEvent,
    "initDataType",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}
