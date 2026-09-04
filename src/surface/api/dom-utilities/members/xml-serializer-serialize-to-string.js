import * as runtime from "../dom-utilities-runtime.js";
import { XMLSerializer } from "../dom-utilities-runtime.js";
import {
  installDispatchedMethod,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedMethod(
    XMLSerializer,
    "serializeToString",
    1,
    runtime.domUtilityOperation,
  );
}
