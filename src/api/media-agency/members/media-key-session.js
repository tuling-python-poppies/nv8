import * as runtime from "../media-agency-runtime.js";
import { MediaKeySession } from "../media-agency-runtime.js";
import { EventTarget as __ExplicitParent } from "../../event/event-target-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MediaKeySession);
}

export function installRelation() {
  installDispatchedRelation(
    MediaKeySession,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    MediaKeySession,
    "sessionId",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    MediaKeySession,
    "expiration",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    MediaKeySession,
    "closed",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    MediaKeySession,
    "keyStatuses",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    MediaKeySession,
    "onkeystatuseschange",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    true,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    MediaKeySession,
    "onmessage",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    true,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    MediaKeySession,
    "close",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember7() {
  installDispatchedMethod(
    MediaKeySession,
    "generateRequest",
    2,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember8() {
  installDispatchedMethod(
    MediaKeySession,
    "load",
    1,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember9() {
  installDispatchedMethod(
    MediaKeySession,
    "remove",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember10() {
  installDispatchedMethod(
    MediaKeySession,
    "update",
    1,
    runtime.mediaAgencyOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MediaKeySession);
}

export function installTag() {
  installDispatchedTag(MediaKeySession);
}
