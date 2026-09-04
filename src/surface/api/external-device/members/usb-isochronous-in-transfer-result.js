import * as runtime from "../external-device-runtime.js";
import { USBIsochronousInTransferResult } from "../external-device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(USBIsochronousInTransferResult);
}

export function installRelation() {
  installDispatchedRelation(
    USBIsochronousInTransferResult,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    USBIsochronousInTransferResult,
    "data",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    USBIsochronousInTransferResult,
    "packets",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(USBIsochronousInTransferResult);
}

export function installTag() {
  installDispatchedTag(USBIsochronousInTransferResult);
}
