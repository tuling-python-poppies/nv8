import * as runtime from "../dom-utilities-runtime.js";
import { CaretPosition } from "../dom-utilities-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(CaretPosition);
}

export function installRelation() {
  installDispatchedRelation(
    CaretPosition,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    CaretPosition,
    "offsetNode",
    runtime.domUtilityProperty,
    null,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    CaretPosition,
    "offset",
    runtime.domUtilityProperty,
    null,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    CaretPosition,
    "getClientRect",
    0,
    runtime.domUtilityOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(CaretPosition);
}

export function installTag() {
  installDispatchedTag(CaretPosition);
}
