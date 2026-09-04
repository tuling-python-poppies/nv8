import * as runtime from "../media-agency-runtime.js";
import { ImageCapture } from "../media-agency-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(ImageCapture);
}

export function installRelation() {
  installDispatchedRelation(
    ImageCapture,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    ImageCapture,
    "track",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    ImageCapture,
    "getPhotoCapabilities",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    ImageCapture,
    "getPhotoSettings",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    ImageCapture,
    "grabFrame",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    ImageCapture,
    "takePhoto",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(ImageCapture);
}

export function installTag() {
  installDispatchedTag(ImageCapture);
}
