import * as runtime from "../media-agency-runtime.js";
import { MediaKeyMessageEvent } from "../media-agency-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    MediaKeyMessageEvent,
    "message",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}
