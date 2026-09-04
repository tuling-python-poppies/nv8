import * as runtime from "../device-runtime.js";
import { GravitySensor } from "../device-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(GravitySensor);
}

export function installRelation() {
  installDispatchedRelation(
    GravitySensor,
    "Accelerometer",
    null,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(GravitySensor);
}

export function installTag() {
  installDispatchedTag(GravitySensor);
}
