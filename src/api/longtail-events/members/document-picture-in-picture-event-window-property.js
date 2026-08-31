import * as runtime from "../longtail-events-runtime.js";
import { DocumentPictureInPictureEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    DocumentPictureInPictureEvent,
    "window",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
