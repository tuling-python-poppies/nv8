import * as runtime from "../external-device-runtime.js";
import { BluetoothRemoteGATTServer } from "../external-device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(BluetoothRemoteGATTServer);
}

export function installRelation() {
  installDispatchedRelation(
    BluetoothRemoteGATTServer,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    BluetoothRemoteGATTServer,
    "device",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    BluetoothRemoteGATTServer,
    "connected",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    BluetoothRemoteGATTServer,
    "connect",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    BluetoothRemoteGATTServer,
    "disconnect",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    BluetoothRemoteGATTServer,
    "getPrimaryService",
    1,
    runtime.externalDeviceOperation,
  );
}

export function installOwnedMember5() {
  installDispatchedMethod(
    BluetoothRemoteGATTServer,
    "getPrimaryServices",
    0,
    runtime.externalDeviceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(BluetoothRemoteGATTServer);
}

export function installTag() {
  installDispatchedTag(BluetoothRemoteGATTServer);
}
