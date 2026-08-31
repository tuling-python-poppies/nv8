import * as runtime from "../navigation-api-runtime.js";
import { NavigateEvent } from "../navigation-api-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    NavigateEvent,
    "hasUAVisualTransition",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}
