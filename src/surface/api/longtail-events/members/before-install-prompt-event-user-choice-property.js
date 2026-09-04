import * as runtime from "../longtail-events-runtime.js";
import { BeforeInstallPromptEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    BeforeInstallPromptEvent,
    "userChoice",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
