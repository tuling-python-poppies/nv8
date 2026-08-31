import * as runtime from "../media-agency-runtime.js";
import { MediaMetadata } from "../media-agency-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MediaMetadata);
}

export function installRelation() {
  installDispatchedRelation(
    MediaMetadata,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    MediaMetadata,
    "title",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    MediaMetadata,
    "artist",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    true,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    MediaMetadata,
    "album",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    true,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    MediaMetadata,
    "artwork",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    true,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    MediaMetadata,
    "chapterInfo",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MediaMetadata);
}

export function installTag() {
  installDispatchedTag(MediaMetadata);
}
