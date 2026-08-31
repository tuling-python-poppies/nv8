import * as runtime from "../longtail-events-runtime.js";
import { PresentationConnectionCloseEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PresentationConnectionCloseEvent);
}

export function installRelation() {
  installDispatchedRelation(
    PresentationConnectionCloseEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PresentationConnectionCloseEvent);
}

export function installTag() {
  installDispatchedTag(PresentationConnectionCloseEvent);
}
