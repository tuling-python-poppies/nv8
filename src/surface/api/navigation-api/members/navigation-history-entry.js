import * as runtime from "../navigation-api-runtime.js";
import { NavigationHistoryEntry } from "../navigation-api-runtime.js";
import { EventTarget as __ExplicitParent } from "../../event/event-target-constructor.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(NavigationHistoryEntry);
}

export function installRelation() {
  installDispatchedRelation(
    NavigationHistoryEntry,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    NavigationHistoryEntry,
    "key",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    NavigationHistoryEntry,
    "id",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    NavigationHistoryEntry,
    "url",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    NavigationHistoryEntry,
    "index",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    NavigationHistoryEntry,
    "sameDocument",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    NavigationHistoryEntry,
    "ondispose",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    true,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    NavigationHistoryEntry,
    "getState",
    0,
    runtime.navigationAPIOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(NavigationHistoryEntry);
}

export function installTag() {
  installDispatchedTag(NavigationHistoryEntry);
}
