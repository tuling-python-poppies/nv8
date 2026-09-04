import * as runtime from "../media-agency-runtime.js";
import { MediaKeyStatusMap } from "../media-agency-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedIterator,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MediaKeyStatusMap);
}

export function installRelation() {
  installDispatchedRelation(
    MediaKeyStatusMap,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    MediaKeyStatusMap,
    "size",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    MediaKeyStatusMap,
    "get",
    1,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    MediaKeyStatusMap,
    "has",
    1,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    MediaKeyStatusMap,
    "entries",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    MediaKeyStatusMap,
    "forEach",
    1,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember5() {
  installDispatchedMethod(
    MediaKeyStatusMap,
    "keys",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    MediaKeyStatusMap,
    "values",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MediaKeyStatusMap);
}

export function installTag() {
  installDispatchedTag(MediaKeyStatusMap);
}

export function installIterator() {
  installDispatchedIterator(
    MediaKeyStatusMap,
    "entries",
    runtime.mediaAgencyIterator,
  );
}
