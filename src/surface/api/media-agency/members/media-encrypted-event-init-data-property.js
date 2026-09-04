import * as runtime from "../media-agency-runtime.js";
import { MediaEncryptedEvent } from "../media-agency-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    MediaEncryptedEvent,
    "initData",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}
