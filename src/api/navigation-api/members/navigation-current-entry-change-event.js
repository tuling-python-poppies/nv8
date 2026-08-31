import * as runtime from "../navigation-api-runtime.js";
import { NavigationCurrentEntryChangeEvent } from "../navigation-api-runtime.js";
import { Event as __ExplicitParent } from "../../event/event-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(NavigationCurrentEntryChangeEvent);
}

export function installRelation() {
  installDispatchedRelation(
    NavigationCurrentEntryChangeEvent,
    "Event",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(NavigationCurrentEntryChangeEvent);
}

export function installTag() {
  installDispatchedTag(NavigationCurrentEntryChangeEvent);
}
