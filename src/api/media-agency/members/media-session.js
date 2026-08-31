import * as runtime from "../media-agency-runtime.js";
import { MediaSession } from "../media-agency-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MediaSession);
}

export function installRelation() {
  installDispatchedRelation(
    MediaSession,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    MediaSession,
    "metadata",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    MediaSession,
    "playbackState",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    true,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    MediaSession,
    "setActionHandler",
    2,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    MediaSession,
    "setCameraActive",
    1,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    MediaSession,
    "setMicrophoneActive",
    1,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember5() {
  installDispatchedMethod(
    MediaSession,
    "setPositionState",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MediaSession);
}

export function installTag() {
  installDispatchedTag(MediaSession);
}
