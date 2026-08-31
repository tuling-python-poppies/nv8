import * as runtime from "../dom-utilities-runtime.js";
import { XPathExpression } from "../dom-utilities-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(XPathExpression);
}

export function installRelation() {
  installDispatchedRelation(
    XPathExpression,
    "Object",
    null,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(XPathExpression);
}

export function installTag() {
  installDispatchedTag(XPathExpression);
}
