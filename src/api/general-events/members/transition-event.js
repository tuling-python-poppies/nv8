import * as runtime from "../general-events-runtime.js";
import { TransitionEvent } from "../general-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(TransitionEvent);
}

export function installRelation() {
  installDispatchedRelation(
    TransitionEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(TransitionEvent);
}

export function installTag() {
  installDispatchedTag(TransitionEvent);
}
