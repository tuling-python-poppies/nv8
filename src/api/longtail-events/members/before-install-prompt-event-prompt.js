import * as runtime from "../longtail-events-runtime.js";
import { BeforeInstallPromptEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedMethod,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedMethod(
    BeforeInstallPromptEvent,
    "prompt",
    0,
    runtime.longtailEventOperation,
  );
}
