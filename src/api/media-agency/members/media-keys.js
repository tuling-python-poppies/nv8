import * as runtime from "../media-agency-runtime.js";
import { MediaKeys } from "../media-agency-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MediaKeys);
}

export function installRelation() {
  installDispatchedRelation(
    MediaKeys,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedMethod(
    MediaKeys,
    "createSession",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    MediaKeys,
    "setServerCertificate",
    1,
    runtime.mediaAgencyOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MediaKeys);
}

export function installOwnedMember2() {
  installDispatchedMethod(
    MediaKeys,
    "getStatusForPolicy",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installTag() {
  installDispatchedTag(MediaKeys);
}
