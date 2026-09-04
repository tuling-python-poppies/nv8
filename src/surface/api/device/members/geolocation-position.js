import * as runtime from "../device-runtime.js";
import { GeolocationPosition } from "../device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(GeolocationPosition);
}

export function installRelation() {
  installDispatchedRelation(
    GeolocationPosition,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    GeolocationPosition,
    "coords",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    GeolocationPosition,
    "timestamp",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    GeolocationPosition,
    "toJSON",
    0,
    runtime.deviceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(GeolocationPosition);
}

export function installTag() {
  installDispatchedTag(GeolocationPosition);
}
