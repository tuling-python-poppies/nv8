import * as runtime from "../external-device-runtime.js";
import { BluetoothCharacteristicProperties } from "../external-device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(BluetoothCharacteristicProperties);
}

export function installRelation() {
  installDispatchedRelation(
    BluetoothCharacteristicProperties,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    BluetoothCharacteristicProperties,
    "broadcast",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    BluetoothCharacteristicProperties,
    "read",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    BluetoothCharacteristicProperties,
    "writeWithoutResponse",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    BluetoothCharacteristicProperties,
    "write",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    BluetoothCharacteristicProperties,
    "notify",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    BluetoothCharacteristicProperties,
    "indicate",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember6() {
  installDispatchedAccessor(
    BluetoothCharacteristicProperties,
    "authenticatedSignedWrites",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember7() {
  installDispatchedAccessor(
    BluetoothCharacteristicProperties,
    "reliableWrite",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember8() {
  installDispatchedAccessor(
    BluetoothCharacteristicProperties,
    "writableAuxiliaries",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(BluetoothCharacteristicProperties);
}

export function installTag() {
  installDispatchedTag(BluetoothCharacteristicProperties);
}
