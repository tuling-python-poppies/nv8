import * as runtime from "../media-agency-runtime.js";
import { MediaStreamTrackGenerator } from "../media-agency-runtime.js";
import { MediaStreamTrack as __ExplicitParent } from "../../media/media-stream-track-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MediaStreamTrackGenerator);
}

export function installRelation() {
  installDispatchedRelation(
    MediaStreamTrackGenerator,
    "MediaStreamTrack",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    MediaStreamTrackGenerator,
    "writable",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MediaStreamTrackGenerator);
}

export function installTag() {
  installDispatchedTag(MediaStreamTrackGenerator);
}
