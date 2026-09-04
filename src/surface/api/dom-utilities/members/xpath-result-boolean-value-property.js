import * as runtime from "../dom-utilities-runtime.js";
import { XPathResult } from "../dom-utilities-runtime.js";
import {
  installDispatchedAccessor,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedAccessor(
    XPathResult,
    "booleanValue",
    runtime.domUtilityProperty,
    null,
    false,
  );
}
