import * as runtime from "../navigator-services-runtime.js";
import { NetworkInformation } from "../navigator-services-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    NetworkInformation,
    "saveData",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}
