import * as runtime from "../dom-utilities-runtime.js";
import { DOMStringMap } from "../dom-utilities-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(DOMStringMap);
}

export function installRelation() {
  installDispatchedRelation(
    DOMStringMap,
    "Object",
    null,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(DOMStringMap);
}

export function installTag() {
  installDispatchedTag(DOMStringMap);
}
