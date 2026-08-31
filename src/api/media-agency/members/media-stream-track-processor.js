import * as runtime from "../media-agency-runtime.js";
import { MediaStreamTrackProcessor } from "../media-agency-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MediaStreamTrackProcessor);
}

export function installRelation() {
  installDispatchedRelation(
    MediaStreamTrackProcessor,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    MediaStreamTrackProcessor,
    "readable",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    MediaStreamTrackProcessor,
    "totalFrames",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    MediaStreamTrackProcessor,
    "discardedFrames",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MediaStreamTrackProcessor);
}

export function installTag() {
  installDispatchedTag(MediaStreamTrackProcessor);
}
