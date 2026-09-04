import * as runtime from "../general-events-runtime.js";
import { ErrorEvent } from "../general-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(ErrorEvent);
}

export function installRelation() {
  installDispatchedRelation(
    ErrorEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(ErrorEvent);
}

export function installTag() {
  installDispatchedTag(ErrorEvent);
}
