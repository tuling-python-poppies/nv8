import * as runtime from "../device-runtime.js";
import { DeviceMotionEventRotationRate } from "../device-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(DeviceMotionEventRotationRate);
}

export function installRelation() {
  installDispatchedRelation(
    DeviceMotionEventRotationRate,
    "Object",
    null,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(DeviceMotionEventRotationRate);
}

export function installTag() {
  installDispatchedTag(DeviceMotionEventRotationRate);
}
