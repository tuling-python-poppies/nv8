import * as runtime from "../longtail-events-runtime.js";
import { InterestEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(InterestEvent);
}

export function installRelation() {
  installDispatchedRelation(
    InterestEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(InterestEvent);
}

export function installTag() {
  installDispatchedTag(InterestEvent);
}
