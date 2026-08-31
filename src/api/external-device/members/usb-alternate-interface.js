import * as runtime from "../external-device-runtime.js";
import { USBAlternateInterface } from "../external-device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(USBAlternateInterface);
}

export function installRelation() {
  installDispatchedRelation(
    USBAlternateInterface,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    USBAlternateInterface,
    "alternateSetting",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    USBAlternateInterface,
    "interfaceClass",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    USBAlternateInterface,
    "interfaceSubclass",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    USBAlternateInterface,
    "interfaceProtocol",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    USBAlternateInterface,
    "interfaceName",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    USBAlternateInterface,
    "endpoints",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(USBAlternateInterface);
}

export function installTag() {
  installDispatchedTag(USBAlternateInterface);
}
