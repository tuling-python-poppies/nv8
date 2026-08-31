import * as runtime from "../dom-utilities-runtime.js";
import { DOMParser } from "../dom-utilities-runtime.js";
import {
  installDispatchedMethod,
} from "../../../webidl/dispatched-surface-install.js";

export function install() {
  installDispatchedMethod(
    DOMParser,
    "parseFromString",
    2,
    runtime.domUtilityOperation,
  );
}
