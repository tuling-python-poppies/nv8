import * as runtime from "../device-runtime.js";
import { GeolocationCoordinates } from "../device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(GeolocationCoordinates);
}

export function installRelation() {
  installDispatchedRelation(
    GeolocationCoordinates,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    GeolocationCoordinates,
    "latitude",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    GeolocationCoordinates,
    "longitude",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    GeolocationCoordinates,
    "altitude",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    GeolocationCoordinates,
    "accuracy",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    GeolocationCoordinates,
    "altitudeAccuracy",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    GeolocationCoordinates,
    "heading",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember6() {
  installDispatchedAccessor(
    GeolocationCoordinates,
    "speed",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember7() {
  installDispatchedMethod(
    GeolocationCoordinates,
    "toJSON",
    0,
    runtime.deviceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(GeolocationCoordinates);
}

export function installTag() {
  installDispatchedTag(GeolocationCoordinates);
}
