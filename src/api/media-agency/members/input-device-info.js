import * as runtime from "../media-agency-runtime.js";
import { InputDeviceInfo } from "../media-agency-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(InputDeviceInfo);
}

export function installRelation() {
  installDispatchedRelation(
    InputDeviceInfo,
    "MediaDeviceInfo",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedMethod(
    InputDeviceInfo,
    "getCapabilities",
    0,
    runtime.mediaAgencyOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(InputDeviceInfo);
}

export function installTag() {
  installDispatchedTag(InputDeviceInfo);
}
