import * as runtime from "../general-events-runtime.js";
import { ProgressEvent } from "../general-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(ProgressEvent);
}

export function installRelation() {
  installDispatchedRelation(
    ProgressEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(ProgressEvent);
}

export function installTag() {
  installDispatchedTag(ProgressEvent);
}
