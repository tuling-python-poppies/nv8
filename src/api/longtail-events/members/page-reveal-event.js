import * as runtime from "../longtail-events-runtime.js";
import { PageRevealEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PageRevealEvent);
}

export function installRelation() {
  installDispatchedRelation(
    PageRevealEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PageRevealEvent);
}

export function installTag() {
  installDispatchedTag(PageRevealEvent);
}
