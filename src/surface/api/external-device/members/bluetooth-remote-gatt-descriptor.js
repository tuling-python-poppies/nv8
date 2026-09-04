import * as runtime from "../external-device-runtime.js";
import { BluetoothRemoteGATTDescriptor } from "../external-device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(BluetoothRemoteGATTDescriptor);
}

export function installRelation() {
  installDispatchedRelation(
    BluetoothRemoteGATTDescriptor,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    BluetoothRemoteGATTDescriptor,
    "characteristic",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    BluetoothRemoteGATTDescriptor,
    "uuid",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    BluetoothRemoteGATTDescriptor,
    "value",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    BluetoothRemoteGATTDescriptor,
    "readValue",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    BluetoothRemoteGATTDescriptor,
    "writeValue",
    1,
    runtime.externalDeviceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(BluetoothRemoteGATTDescriptor);
}

export function installTag() {
  installDispatchedTag(BluetoothRemoteGATTDescriptor);
}
