import * as runtime from "../external-device-runtime.js";
import { USBOutTransferResult } from "../external-device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(USBOutTransferResult);
}

export function installRelation() {
  installDispatchedRelation(
    USBOutTransferResult,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    USBOutTransferResult,
    "bytesWritten",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    USBOutTransferResult,
    "status",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(USBOutTransferResult);
}

export function installTag() {
  installDispatchedTag(USBOutTransferResult);
}
