import * as runtime from "../external-device-runtime.js";
import { BluetoothDevice } from "../external-device-runtime.js";
import { EventTarget as __ExplicitParent } from "../../event/event-target-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(BluetoothDevice);
}

export function installRelation() {
  installDispatchedRelation(
    BluetoothDevice,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    BluetoothDevice,
    "id",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    BluetoothDevice,
    "name",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    BluetoothDevice,
    "gatt",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    BluetoothDevice,
    "ongattserverdisconnected",
    runtime.externalDeviceProperty,
    runtime.setExternalDeviceProperty,
    true,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(BluetoothDevice);
}

export function installTag() {
  installDispatchedTag(BluetoothDevice);
}
