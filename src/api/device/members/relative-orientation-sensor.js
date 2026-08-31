import * as runtime from "../device-runtime.js";
import { RelativeOrientationSensor } from "../device-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(RelativeOrientationSensor);
}

export function installRelation() {
  installDispatchedRelation(
    RelativeOrientationSensor,
    "OrientationSensor",
    null,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(RelativeOrientationSensor);
}

export function installTag() {
  installDispatchedTag(RelativeOrientationSensor);
}
