import * as runtime from "../navigation-api-runtime.js";
import { NavigationPrecommitController } from "../navigation-api-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(NavigationPrecommitController);
}

export function installRelation() {
  installDispatchedRelation(
    NavigationPrecommitController,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedMethod(
    NavigationPrecommitController,
    "redirect",
    1,
    runtime.navigationAPIOperation,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    NavigationPrecommitController,
    "addHandler",
    1,
    runtime.navigationAPIOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(NavigationPrecommitController);
}

export function installTag() {
  installDispatchedTag(NavigationPrecommitController);
}
