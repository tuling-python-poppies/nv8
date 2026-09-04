import * as runtime from "../media-agency-runtime.js";
import { MediaDevices } from "../media-agency-runtime.js";
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
  installDispatchedGlobal(MediaDevices);
}

export function installRelation() {
  installDispatchedRelation(
    MediaDevices,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    MediaDevices,
    "ondevicechange",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    true,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    MediaDevices,
    "enumerateDevices",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    MediaDevices,
    "getSupportedConstraints",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    MediaDevices,
    "getUserMedia",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    MediaDevices,
    "getDisplayMedia",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember5() {
  installDispatchedMethod(
    MediaDevices,
    "setCaptureHandleConfig",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MediaDevices);
}

export function installTag() {
  installDispatchedTag(MediaDevices);
}
