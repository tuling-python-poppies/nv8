import * as runtime from "../general-events-runtime.js";
import { CloseEvent } from "../general-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(CloseEvent);
}

export function installRelation() {
  installDispatchedRelation(
    CloseEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(CloseEvent);
}

export function installTag() {
  installDispatchedTag(CloseEvent);
}
