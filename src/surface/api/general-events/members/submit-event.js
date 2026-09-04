import * as runtime from "../general-events-runtime.js";
import { SubmitEvent } from "../general-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(SubmitEvent);
}

export function installRelation() {
  installDispatchedRelation(
    SubmitEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(SubmitEvent);
}

export function installTag() {
  installDispatchedTag(SubmitEvent);
}
