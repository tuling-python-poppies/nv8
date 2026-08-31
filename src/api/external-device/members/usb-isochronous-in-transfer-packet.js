import * as runtime from "../external-device-runtime.js";
import { USBIsochronousInTransferPacket } from "../external-device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(USBIsochronousInTransferPacket);
}

export function installRelation() {
  installDispatchedRelation(
    USBIsochronousInTransferPacket,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    USBIsochronousInTransferPacket,
    "status",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    USBIsochronousInTransferPacket,
    "data",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(USBIsochronousInTransferPacket);
}

export function installTag() {
  installDispatchedTag(USBIsochronousInTransferPacket);
}
