import * as runtime from "../dom-utilities-runtime.js";
import { XPathExpression } from "../dom-utilities-runtime.js";
import {
  installDispatchedMethod,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedMethod(
    XPathExpression,
    "evaluate",
    1,
    runtime.domUtilityOperation,
  );
}
