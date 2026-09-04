import * as runtime from "../general-events-runtime.js";
import { PromiseRejectionEvent } from "../general-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PromiseRejectionEvent);
}

export function installRelation() {
  installDispatchedRelation(
    PromiseRejectionEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PromiseRejectionEvent);
}

export function installTag() {
  installDispatchedTag(PromiseRejectionEvent);
}
