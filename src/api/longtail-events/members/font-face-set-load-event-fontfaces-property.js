import * as runtime from "../longtail-events-runtime.js";
import { FontFaceSetLoadEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    FontFaceSetLoadEvent,
    "fontfaces",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
