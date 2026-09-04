import * as runtime from "../navigation-api-runtime.js";
import { Navigation } from "../navigation-api-runtime.js";
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
  installDispatchedGlobal(Navigation);
}

export function installRelation() {
  installDispatchedRelation(
    Navigation,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    Navigation,
    "currentEntry",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    Navigation,
    "transition",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    Navigation,
    "activation",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    Navigation,
    "canGoBack",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedAccessor(
    Navigation,
    "canGoForward",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    false,
  );
}

export function installOwnedMember5() {
  installDispatchedAccessor(
    Navigation,
    "onnavigate",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    true,
  );
}

export function installOwnedMember6() {
  installDispatchedAccessor(
    Navigation,
    "onnavigatesuccess",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    true,
  );
}

export function installOwnedMember7() {
  installDispatchedAccessor(
    Navigation,
    "onnavigateerror",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    true,
  );
}

export function installOwnedMember8() {
  installDispatchedAccessor(
    Navigation,
    "oncurrententrychange",
    runtime.navigationAPIProperty,
    runtime.setNavigationAPIProperty,
    true,
  );
}

export function installOwnedMember9() {
  installDispatchedMethod(
    Navigation,
    "back",
    0,
    runtime.navigationAPIOperation,
  );
}

export function installOwnedMember10() {
  installDispatchedMethod(
    Navigation,
    "entries",
    0,
    runtime.navigationAPIOperation,
  );
}

export function installOwnedMember11() {
  installDispatchedMethod(
    Navigation,
    "forward",
    0,
    runtime.navigationAPIOperation,
  );
}

export function installOwnedMember12() {
  installDispatchedMethod(
    Navigation,
    "navigate",
    1,
    runtime.navigationAPIOperation,
  );
}

export function installOwnedMember13() {
  installDispatchedMethod(
    Navigation,
    "reload",
    0,
    runtime.navigationAPIOperation,
  );
}

export function installOwnedMember14() {
  installDispatchedMethod(
    Navigation,
    "traverseTo",
    1,
    runtime.navigationAPIOperation,
  );
}

export function installOwnedMember15() {
  installDispatchedMethod(
    Navigation,
    "updateCurrentEntry",
    1,
    runtime.navigationAPIOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(Navigation);
}

export function installTag() {
  installDispatchedTag(Navigation);
}
