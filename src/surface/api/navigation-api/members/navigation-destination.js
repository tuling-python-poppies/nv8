import * as runtime from "../navigation-api-runtime.js";
import { NavigationDestination } from "../navigation-api-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(NavigationDestination);
}

export function installRelation() {
  installDispatchedRelation(
    NavigationDestination,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    NavigationDestination,
    "key",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    NavigationDestination,
    "id",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    NavigationDestination,
    "url",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    NavigationDestination,
    "index",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    NavigationDestination,
    "sameDocument",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedMethod(
    NavigationDestination,
    "getState",
    0,
    runtime.navigationAPIOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(NavigationDestination);
}

export function installTag() {
  installDispatchedTag(NavigationDestination);
}
