import * as runtime from "../longtail-events-runtime.js";
import { AudioProcessingEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    AudioProcessingEvent,
    "outputBuffer",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
