import * as runtime from "../dom-utilities-runtime.js";
import { DOMStringList } from "../dom-utilities-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedIterator,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(DOMStringList);
}

export function installRelation() {
  installDispatchedRelation(
    DOMStringList,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    DOMStringList,
    "length",
    runtime.domUtilityProperty,
    null,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    DOMStringList,
    "contains",
    1,
    runtime.domUtilityOperation,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    DOMStringList,
    "item",
    1,
    runtime.domUtilityOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(DOMStringList);
}

export function installTag() {
  installDispatchedTag(DOMStringList);
}

export function installIterator() {
  installDispatchedIterator(
    DOMStringList,
    "values",
    runtime.domUtilityIterator,
  );
}
