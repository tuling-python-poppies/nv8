import * as runtime from "../media-agency-runtime.js";
import { MediaDeviceInfo } from "../media-agency-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MediaDeviceInfo);
}

export function installRelation() {
  installDispatchedRelation(
    MediaDeviceInfo,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    MediaDeviceInfo,
    "deviceId",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    MediaDeviceInfo,
    "kind",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    MediaDeviceInfo,
    "label",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    MediaDeviceInfo,
    "groupId",
    runtime.mediaAgencyProperty,
    runtime.setMediaAgencyProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    MediaDeviceInfo,
    "toJSON",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MediaDeviceInfo);
}

export function installTag() {
  installDispatchedTag(MediaDeviceInfo);
}
