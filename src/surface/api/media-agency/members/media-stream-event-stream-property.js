import * as runtime from "../media-agency-runtime.js";
import { MediaStreamEvent } from "../media-agency-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    MediaStreamEvent,
    "stream",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}
