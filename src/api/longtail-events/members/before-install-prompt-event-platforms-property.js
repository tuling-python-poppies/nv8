import * as runtime from "../longtail-events-runtime.js";
import { BeforeInstallPromptEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    BeforeInstallPromptEvent,
    "platforms",
    runtime.longtailEventProperty,
    runtime.setLongtailEventProperty,
    false,
  );
}
