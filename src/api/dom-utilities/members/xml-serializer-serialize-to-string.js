import * as runtime from "../dom-utilities-runtime.js";
import { XMLSerializer } from "../dom-utilities-runtime.js";
import {
  installDispatchedMethod,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedMethod(
    XMLSerializer,
    "serializeToString",
    1,
    runtime.domUtilityOperation,
  );
}
