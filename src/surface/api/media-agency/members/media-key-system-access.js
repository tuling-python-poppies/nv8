import * as runtime from "../media-agency-runtime.js";
import { MediaKeySystemAccess } from "../media-agency-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MediaKeySystemAccess);
}

export function installRelation() {
  installDispatchedRelation(
    MediaKeySystemAccess,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    MediaKeySystemAccess,
    "keySystem",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    MediaKeySystemAccess,
    "createMediaKeys",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    MediaKeySystemAccess,
    "getConfiguration",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MediaKeySystemAccess);
}

export function installTag() {
  installDispatchedTag(MediaKeySystemAccess);
}
