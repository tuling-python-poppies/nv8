import * as runtime from "../dom-utilities-runtime.js";
import { XPathEvaluator } from "../dom-utilities-runtime.js";
import {
  installDispatchedMethod,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedMethod(
    XPathEvaluator,
    "createExpression",
    1,
    runtime.domUtilityOperation,
  );
}
