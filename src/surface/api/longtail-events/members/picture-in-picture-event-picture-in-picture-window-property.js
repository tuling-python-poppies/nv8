import * as runtime from "../longtail-events-runtime.js";
import { PictureInPictureEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    PictureInPictureEvent,
    "pictureInPictureWindow",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
