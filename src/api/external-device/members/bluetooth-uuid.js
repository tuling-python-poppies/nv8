import * as runtime from "../external-device-runtime.js";
import { BluetoothUUID } from "../external-device-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(BluetoothUUID);
}

export function installRelation() {
  installDispatchedRelation(
    BluetoothUUID,
    "Object",
    null,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(BluetoothUUID);
}

export function installTag() {
  installDispatchedTag(BluetoothUUID);
}
