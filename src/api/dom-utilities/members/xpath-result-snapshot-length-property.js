import * as runtime from "../dom-utilities-runtime.js";
import { XPathResult } from "../dom-utilities-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    XPathResult,
    "snapshotLength",
    runtime.domUtilityProperty,
    null,
    false,
  );
}
