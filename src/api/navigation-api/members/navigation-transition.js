import * as runtime from "../navigation-api-runtime.js";
import { NavigationTransition } from "../navigation-api-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(NavigationTransition);
}

export function installRelation() {
  installDispatchedRelation(
    NavigationTransition,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    NavigationTransition,
    "navigationType",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    NavigationTransition,
    "from",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    NavigationTransition,
    "to",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    NavigationTransition,
    "committed",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    NavigationTransition,
    "finished",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(NavigationTransition);
}

export function installTag() {
  installDispatchedTag(NavigationTransition);
}
