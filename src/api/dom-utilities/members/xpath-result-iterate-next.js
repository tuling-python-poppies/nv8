import * as runtime from "../dom-utilities-runtime.js";
import { XPathResult } from "../dom-utilities-runtime.js";
import {
  installDispatchedMethod,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedMethod(
    XPathResult,
    "iterateNext",
    0,
    runtime.domUtilityOperation,
  );
}
