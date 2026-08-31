import * as runtime from "../media-agency-runtime.js";
import { BrowserCaptureMediaStreamTrack } from "../media-agency-runtime.js";
import { MediaStreamTrack as __ExplicitParent } from "../../media/media-stream-track-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(BrowserCaptureMediaStreamTrack);
}

export function installRelation() {
  installDispatchedRelation(
    BrowserCaptureMediaStreamTrack,
    "MediaStreamTrack",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedMethod(
    BrowserCaptureMediaStreamTrack,
    "cropTo",
    1,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    BrowserCaptureMediaStreamTrack,
    "restrictTo",
    1,
    runtime.mediaAgencyOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(BrowserCaptureMediaStreamTrack);
}

export function installTag() {
  installDispatchedTag(BrowserCaptureMediaStreamTrack);
}
