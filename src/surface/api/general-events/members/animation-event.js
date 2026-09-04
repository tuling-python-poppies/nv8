import * as runtime from "../general-events-runtime.js";
import { AnimationEvent } from "../general-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(AnimationEvent);
}

export function installRelation() {
  installDispatchedRelation(
    AnimationEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(AnimationEvent);
}

export function installTag() {
  installDispatchedTag(AnimationEvent);
}
