import * as runtime from "../external-device-runtime.js";
import { BluetoothRemoteGATTCharacteristic } from "../external-device-runtime.js";
import { EventTarget as __ExplicitParent } from "../../event/event-target-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(BluetoothRemoteGATTCharacteristic);
}

export function installRelation() {
  installDispatchedRelation(
    BluetoothRemoteGATTCharacteristic,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    BluetoothRemoteGATTCharacteristic,
    "service",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    BluetoothRemoteGATTCharacteristic,
    "uuid",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    BluetoothRemoteGATTCharacteristic,
    "properties",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    BluetoothRemoteGATTCharacteristic,
    "value",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    BluetoothRemoteGATTCharacteristic,
    "oncharacteristicvaluechanged",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    true,
  );
}

export function installOwnedMember5() {
  installDispatchedMethod(
    BluetoothRemoteGATTCharacteristic,
    "getDescriptor",
    1,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    BluetoothRemoteGATTCharacteristic,
    "getDescriptors",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember7() {
  installDispatchedMethod(
    BluetoothRemoteGATTCharacteristic,
    "readValue",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember8() {
  installDispatchedMethod(
    BluetoothRemoteGATTCharacteristic,
    "startNotifications",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember9() {
  installDispatchedMethod(
    BluetoothRemoteGATTCharacteristic,
    "stopNotifications",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember10() {
  installDispatchedMethod(
    BluetoothRemoteGATTCharacteristic,
    "writeValue",
    1,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember11() {
  installDispatchedMethod(
    BluetoothRemoteGATTCharacteristic,
    "writeValueWithResponse",
    1,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember12() {
  installDispatchedMethod(
    BluetoothRemoteGATTCharacteristic,
    "writeValueWithoutResponse",
    1,
    runtime.externalDeviceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(BluetoothRemoteGATTCharacteristic);
}

export function installTag() {
  installDispatchedTag(BluetoothRemoteGATTCharacteristic);
}
