import * as runtime from "../media-agency-runtime.js";
import { MediaStreamTrackVideoStats } from "../media-agency-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MediaStreamTrackVideoStats);
}

export function installRelation() {
  installDispatchedRelation(
    MediaStreamTrackVideoStats,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    MediaStreamTrackVideoStats,
    "deliveredFrames",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    MediaStreamTrackVideoStats,
    "discardedFrames",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    MediaStreamTrackVideoStats,
    "totalFrames",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    MediaStreamTrackVideoStats,
    "toJSON",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MediaStreamTrackVideoStats);
}

export function installTag() {
  installDispatchedTag(MediaStreamTrackVideoStats);
}
