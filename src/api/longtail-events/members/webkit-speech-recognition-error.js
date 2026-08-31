import { webkitSpeechRecognitionError as Constructor } from "../longtail-events-runtime.js";
import { installDispatchedGlobal } from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(
    Constructor,
    "webkitSpeechRecognitionError",
    false,
  );
}
