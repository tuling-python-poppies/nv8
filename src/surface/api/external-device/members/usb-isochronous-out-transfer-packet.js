import * as runtime from "../external-device-runtime.js";
import { USBIsochronousOutTransferPacket } from "../external-device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(USBIsochronousOutTransferPacket);
}

export function installRelation() {
  installDispatchedRelation(
    USBIsochronousOutTransferPacket,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    USBIsochronousOutTransferPacket,
    "bytesWritten",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    USBIsochronousOutTransferPacket,
    "status",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(USBIsochronousOutTransferPacket);
}

export function installTag() {
  installDispatchedTag(USBIsochronousOutTransferPacket);
}
