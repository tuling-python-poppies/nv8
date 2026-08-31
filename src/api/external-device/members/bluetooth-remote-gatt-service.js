import * as runtime from "../external-device-runtime.js";
import { BluetoothRemoteGATTService } from "../external-device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(BluetoothRemoteGATTService);
}

export function installRelation() {
  installDispatchedRelation(
    BluetoothRemoteGATTService,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    BluetoothRemoteGATTService,
    "device",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    BluetoothRemoteGATTService,
    "uuid",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    BluetoothRemoteGATTService,
    "isPrimary",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    BluetoothRemoteGATTService,
    "getCharacteristic",
    1,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    BluetoothRemoteGATTService,
    "getCharacteristics",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(BluetoothRemoteGATTService);
}

export function installTag() {
  installDispatchedTag(BluetoothRemoteGATTService);
}
