import * as runtime from "../dom-utilities-runtime.js";
import { XPathEvaluator } from "../dom-utilities-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(XPathEvaluator);
}

export function installRelation() {
  installDispatchedRelation(
    XPathEvaluator,
    "Object",
    null,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(XPathEvaluator);
}

export function installTag() {
  installDispatchedTag(XPathEvaluator);
}
