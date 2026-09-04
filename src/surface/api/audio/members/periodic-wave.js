import * as runtime from "../audio-runtime.js";
import { PeriodicWave } from "../audio-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PeriodicWave);
}

export function installRelation() {
  installDispatchedRelation(
    PeriodicWave,
    "Object",
    null,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PeriodicWave);
}

export function installTag() {
  installDispatchedTag(PeriodicWave);
}
