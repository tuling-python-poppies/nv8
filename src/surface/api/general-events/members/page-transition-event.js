import * as runtime from "../general-events-runtime.js";
import { PageTransitionEvent } from "../general-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PageTransitionEvent);
}

export function installRelation() {
  installDispatchedRelation(
    PageTransitionEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PageTransitionEvent);
}

export function installTag() {
  installDispatchedTag(PageTransitionEvent);
}
