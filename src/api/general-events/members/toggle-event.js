import * as runtime from "../general-events-runtime.js";
import { ToggleEvent } from "../general-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(ToggleEvent);
}

export function installRelation() {
  installDispatchedRelation(
    ToggleEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(ToggleEvent);
}

export function installTag() {
  installDispatchedTag(ToggleEvent);
}
