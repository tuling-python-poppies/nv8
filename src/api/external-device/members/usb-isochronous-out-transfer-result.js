import * as runtime from "../external-device-runtime.js";
import { USBIsochronousOutTransferResult } from "../external-device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(USBIsochronousOutTransferResult);
}

export function installRelation() {
  installDispatchedRelation(
    USBIsochronousOutTransferResult,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    USBIsochronousOutTransferResult,
    "packets",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(USBIsochronousOutTransferResult);
}

export function installTag() {
  installDispatchedTag(USBIsochronousOutTransferResult);
}
