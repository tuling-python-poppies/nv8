import * as runtime from "../longtail-events-runtime.js";
import { MIDIConnectionEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    MIDIConnectionEvent,
    "port",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
