import * as runtime from "../performance-longtail-runtime.js";
import { EventCounts } from "../performance-longtail-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedIterator,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(EventCounts);
}

export function installRelation() {
  installDispatchedRelation(
    EventCounts,
    "Object",
    null,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(EventCounts);
}

export function installTag() {
  installDispatchedTag(EventCounts);
}

export function installIterator() {
  installDispatchedIterator(
    EventCounts,
    "entries",
    runtime.performanceLongtailIterator,
  );
}
