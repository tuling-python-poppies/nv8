import * as runtime from "../navigation-api-runtime.js";
import { NavigationCurrentEntryChangeEvent } from "../navigation-api-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    NavigationCurrentEntryChangeEvent,
    "navigationType",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}
