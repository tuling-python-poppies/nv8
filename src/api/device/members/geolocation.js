import * as runtime from "../device-runtime.js";
import { Geolocation } from "../device-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(Geolocation);
}

export function installRelation() {
  installDispatchedRelation(
    Geolocation,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedMethod(
    Geolocation,
    "clearWatch",
    1,
    runtime.deviceOperation,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    Geolocation,
    "getCurrentPosition",
    1,
    runtime.deviceOperation,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    Geolocation,
    "watchPosition",
    1,
    runtime.deviceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(Geolocation);
}

export function installTag() {
  installDispatchedTag(Geolocation);
}
