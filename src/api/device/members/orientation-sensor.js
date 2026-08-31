import * as runtime from "../device-runtime.js";
import { OrientationSensor } from "../device-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(OrientationSensor);
}

export function installRelation() {
  installDispatchedRelation(
    OrientationSensor,
    "Sensor",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    OrientationSensor,
    "quaternion",
    runtime.deviceProperty,
    runtime.setDeviceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    OrientationSensor,
    "populateMatrix",
    1,
    runtime.deviceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(OrientationSensor);
}

export function installTag() {
  installDispatchedTag(OrientationSensor);
}
