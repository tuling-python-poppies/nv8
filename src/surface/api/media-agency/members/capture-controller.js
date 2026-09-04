import * as runtime from "../media-agency-runtime.js";
import { CaptureController } from "../media-agency-runtime.js";
import { EventTarget as __ExplicitParent } from "../../event/event-target-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(CaptureController);
}

export function installRelation() {
  installDispatchedRelation(
    CaptureController,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedMethod(
    CaptureController,
    "setFocusBehavior",
    1,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    CaptureController,
    "zoomLevel",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    CaptureController,
    "onzoomlevelchange",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    true,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    CaptureController,
    "decreaseZoomLevel",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    CaptureController,
    "forwardWheel",
    1,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember5() {
  installDispatchedMethod(
    CaptureController,
    "getSupportedZoomLevels",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    CaptureController,
    "increaseZoomLevel",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember7() {
  installDispatchedMethod(
    CaptureController,
    "resetZoomLevel",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(CaptureController);
}

export function installTag() {
  installDispatchedTag(CaptureController);
}
