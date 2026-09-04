import * as runtime from "../navigation-api-runtime.js";
import { NavigationActivation } from "../navigation-api-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(NavigationActivation);
}

export function installRelation() {
  installDispatchedRelation(
    NavigationActivation,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    NavigationActivation,
    "entry",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    NavigationActivation,
    "from",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    NavigationActivation,
    "navigationType",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(NavigationActivation);
}

export function installTag() {
  installDispatchedTag(NavigationActivation);
}
