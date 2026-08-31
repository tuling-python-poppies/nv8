import * as runtime from "../longtail-events-runtime.js";
import { SpeechRecognitionEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    SpeechRecognitionEvent,
    "resultIndex",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
