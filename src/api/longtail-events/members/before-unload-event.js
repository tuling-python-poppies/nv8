import * as runtime from "../longtail-events-runtime.js";
import { BeforeUnloadEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(BeforeUnloadEvent);
}

export function installRelation() {
  installDispatchedRelation(
    BeforeUnloadEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(BeforeUnloadEvent);
}

export function installTag() {
  installDispatchedTag(BeforeUnloadEvent);
}
