import * as runtime from "../device-runtime.js";
import { GeolocationPositionError } from "../device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstant,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(GeolocationPositionError);
}

export function installRelation() {
  installDispatchedRelation(
    GeolocationPositionError,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    GeolocationPositionError,
    "code",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    GeolocationPositionError,
    "message",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installConstant0() {
  installDispatchedConstant(
    GeolocationPositionError,
    "PERMISSION_DENIED",
    1,
  );
}

export function installConstant1() {
  installDispatchedConstant(
    GeolocationPositionError,
    "POSITION_UNAVAILABLE",
    2,
  );
}

export function installConstant2() {
  installDispatchedConstant(
    GeolocationPositionError,
    "TIMEOUT",
    3,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(GeolocationPositionError);
}

export function installTag() {
  installDispatchedTag(GeolocationPositionError);
}
