import * as runtime from "../longtail-events-runtime.js";
import { ContentVisibilityAutoStateChangeEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(ContentVisibilityAutoStateChangeEvent);
}

export function installRelation() {
  installDispatchedRelation(
    ContentVisibilityAutoStateChangeEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(ContentVisibilityAutoStateChangeEvent);
}

export function installTag() {
  installDispatchedTag(ContentVisibilityAutoStateChangeEvent);
}
