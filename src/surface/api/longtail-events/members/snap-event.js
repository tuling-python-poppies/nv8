import * as runtime from "../longtail-events-runtime.js";
import { SnapEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(SnapEvent);
}

export function installRelation() {
  installDispatchedRelation(
    SnapEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(SnapEvent);
}

export function installTag() {
  installDispatchedTag(SnapEvent);
}
