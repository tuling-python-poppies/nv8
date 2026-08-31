import * as runtime from "../device-runtime.js";
import { AbsoluteOrientationSensor } from "../device-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(AbsoluteOrientationSensor);
}

export function installRelation() {
  installDispatchedRelation(
    AbsoluteOrientationSensor,
    "OrientationSensor",
    null,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(AbsoluteOrientationSensor);
}

export function installTag() {
  installDispatchedTag(AbsoluteOrientationSensor);
}
