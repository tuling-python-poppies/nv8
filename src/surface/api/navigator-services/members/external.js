import * as runtime from "../navigator-services-runtime.js";
import { External } from "../navigator-services-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(External);
}

export function installRelation() {
  installDispatchedRelation(
    External,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedMethod(
    External,
    "AddSearchProvider",
    0,
    runtime.navigatorServiceOperation,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    External,
    "IsSearchProviderInstalled",
    0,
    runtime.navigatorServiceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(External);
}

export function installTag() {
  installDispatchedTag(External);
}
