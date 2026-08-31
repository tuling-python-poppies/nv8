import * as runtime from "../navigation-api-runtime.js";
import { NavigateEvent } from "../navigation-api-runtime.js";
import {
  installDispatchedMethod,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedMethod(
    NavigateEvent,
    "intercept",
    0,
    runtime.navigationAPIOperation,
  );
}
