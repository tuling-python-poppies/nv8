import * as runtime from "../longtail-events-runtime.js";
import { PresentationConnectionAvailableEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PresentationConnectionAvailableEvent);
}

export function installRelation() {
  installDispatchedRelation(
    PresentationConnectionAvailableEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PresentationConnectionAvailableEvent);
}

export function installTag() {
  installDispatchedTag(PresentationConnectionAvailableEvent);
}
