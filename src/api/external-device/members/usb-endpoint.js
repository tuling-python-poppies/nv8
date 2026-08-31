import * as runtime from "../external-device-runtime.js";
import { USBEndpoint } from "../external-device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(USBEndpoint);
}

export function installRelation() {
  installDispatchedRelation(
    USBEndpoint,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    USBEndpoint,
    "endpointNumber",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    USBEndpoint,
    "direction",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    USBEndpoint,
    "type",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    USBEndpoint,
    "packetSize",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(USBEndpoint);
}

export function installTag() {
  installDispatchedTag(USBEndpoint);
}
