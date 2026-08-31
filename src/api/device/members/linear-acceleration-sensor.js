import * as runtime from "../device-runtime.js";
import { LinearAccelerationSensor } from "../device-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(LinearAccelerationSensor);
}

export function installRelation() {
  installDispatchedRelation(
    LinearAccelerationSensor,
    "Accelerometer",
    null,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(LinearAccelerationSensor);
}

export function installTag() {
  installDispatchedTag(LinearAccelerationSensor);
}
