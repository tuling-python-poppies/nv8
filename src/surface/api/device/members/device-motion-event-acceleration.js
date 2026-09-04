import * as runtime from "../device-runtime.js";
import { DeviceMotionEventAcceleration } from "../device-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(DeviceMotionEventAcceleration);
}

export function installRelation() {
  installDispatchedRelation(
    DeviceMotionEventAcceleration,
    "Object",
    null,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(DeviceMotionEventAcceleration);
}

export function installTag() {
  installDispatchedTag(DeviceMotionEventAcceleration);
}
