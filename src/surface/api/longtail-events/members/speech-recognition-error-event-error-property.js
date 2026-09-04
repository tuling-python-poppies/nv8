import * as runtime from "../longtail-events-runtime.js";
import { SpeechRecognitionErrorEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    SpeechRecognitionErrorEvent,
    "error",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
