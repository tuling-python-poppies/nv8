import * as runtime from "../dom-utilities-runtime.js";
import { DOMParser } from "../dom-utilities-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(DOMParser);
}

export function installRelation() {
  installDispatchedRelation(
    DOMParser,
    "Object",
    null,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(DOMParser);
}

export function installTag() {
  installDispatchedTag(DOMParser);
}
