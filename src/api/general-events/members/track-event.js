import * as runtime from "../general-events-runtime.js";
import { TrackEvent } from "../general-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(TrackEvent);
}

export function installRelation() {
  installDispatchedRelation(
    TrackEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(TrackEvent);
}

export function installTag() {
  installDispatchedTag(TrackEvent);
}
