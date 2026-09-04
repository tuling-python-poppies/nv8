import * as runtime from "../performance-longtail-runtime.js";
import { VisibilityStateEntry } from "../performance-longtail-runtime.js";
import { PerformanceEntry as __ExplicitParent } from "../performance-entry-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(VisibilityStateEntry);
}

export function installRelation() {
  installDispatchedRelation(
    VisibilityStateEntry,
    "PerformanceEntry",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(VisibilityStateEntry);
}

export function installTag() {
  installDispatchedTag(VisibilityStateEntry);
}
