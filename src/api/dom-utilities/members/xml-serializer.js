import * as runtime from "../dom-utilities-runtime.js";
import { XMLSerializer } from "../dom-utilities-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(XMLSerializer);
}

export function installRelation() {
  installDispatchedRelation(
    XMLSerializer,
    "Object",
    null,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(XMLSerializer);
}

export function installTag() {
  installDispatchedTag(XMLSerializer);
}
