import * as runtime from "../longtail-events-runtime.js";
import { MIDIMessageEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    MIDIMessageEvent,
    "data",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
