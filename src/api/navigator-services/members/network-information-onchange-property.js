import * as runtime from "../navigator-services-runtime.js";
import { NetworkInformation } from "../navigator-services-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    NetworkInformation,
    "onchange",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    true,
  );
}
