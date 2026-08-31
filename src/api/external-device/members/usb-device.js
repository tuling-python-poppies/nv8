import * as runtime from "../external-device-runtime.js";
import { USBDevice } from "../external-device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(USBDevice);
}

export function installRelation() {
  installDispatchedRelation(
    USBDevice,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    USBDevice,
    "usbVersionMajor",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    USBDevice,
    "usbVersionMinor",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    USBDevice,
    "usbVersionSubminor",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    USBDevice,
    "deviceClass",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    USBDevice,
    "deviceSubclass",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    USBDevice,
    "deviceProtocol",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember6() {
  installDispatchedAccessor(
    USBDevice,
    "vendorId",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember7() {
  installDispatchedAccessor(
    USBDevice,
    "productId",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember8() {
  installDispatchedAccessor(
    USBDevice,
    "deviceVersionMajor",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember9() {
  installDispatchedAccessor(
    USBDevice,
    "deviceVersionMinor",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember10() {
  installDispatchedAccessor(
    USBDevice,
    "deviceVersionSubminor",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember11() {
  installDispatchedAccessor(
    USBDevice,
    "manufacturerName",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember12() {
  installDispatchedAccessor(
    USBDevice,
    "productName",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember13() {
  installDispatchedAccessor(
    USBDevice,
    "serialNumber",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember14() {
  installDispatchedAccessor(
    USBDevice,
    "configuration",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember15() {
  installDispatchedAccessor(
    USBDevice,
    "configurations",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember16() {
  installDispatchedAccessor(
    USBDevice,
    "opened",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember17() {
  installDispatchedMethod(
    USBDevice,
    "claimInterface",
    1,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember18() {
  installDispatchedMethod(
    USBDevice,
    "clearHalt",
    2,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember19() {
  installDispatchedMethod(
    USBDevice,
    "close",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember20() {
  installDispatchedMethod(
    USBDevice,
    "controlTransferIn",
    2,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember21() {
  installDispatchedMethod(
    USBDevice,
    "controlTransferOut",
    1,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember22() {
  installDispatchedMethod(
    USBDevice,
    "forget",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember23() {
  installDispatchedMethod(
    USBDevice,
    "isochronousTransferIn",
    2,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember24() {
  installDispatchedMethod(
    USBDevice,
    "isochronousTransferOut",
    3,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember25() {
  installDispatchedMethod(
    USBDevice,
    "open",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember26() {
  installDispatchedMethod(
    USBDevice,
    "releaseInterface",
    1,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember27() {
  installDispatchedMethod(
    USBDevice,
    "reset",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember28() {
  installDispatchedMethod(
    USBDevice,
    "selectAlternateInterface",
    2,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember29() {
  installDispatchedMethod(
    USBDevice,
    "selectConfiguration",
    1,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember30() {
  installDispatchedMethod(
    USBDevice,
    "transferIn",
    2,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember31() {
  installDispatchedMethod(
    USBDevice,
    "transferOut",
    2,
    runtime.externalDeviceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(USBDevice);
}

export function installTag() {
  installDispatchedTag(USBDevice);
}
