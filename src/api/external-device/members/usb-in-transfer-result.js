import * as runtime from "../external-device-runtime.js";
import { USBInTransferResult } from "../external-device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(USBInTransferResult);
}

export function installRelation() {
  installDispatchedRelation(
    USBInTransferResult,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    USBInTransferResult,
    "data",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    USBInTransferResult,
    "status",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(USBInTransferResult);
}

export function installTag() {
  installDispatchedTag(USBInTransferResult);
}
