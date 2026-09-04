import * as runtime from "../navigator-services-runtime.js";
import { Keyboard } from "../navigator-services-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(Keyboard);
}

export function installRelation() {
  installDispatchedRelation(
    Keyboard,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedMethod(
    Keyboard,
    "getLayoutMap",
    0,
    runtime.navigatorServiceOperation,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    Keyboard,
    "lock",
    0,
    runtime.navigatorServiceOperation,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    Keyboard,
    "unlock",
    0,
    runtime.navigatorServiceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(Keyboard);
}

export function installTag() {
  installDispatchedTag(Keyboard);
}
