import * as runtime from "../navigator-services-runtime.js";
import { KeyboardLayoutMap } from "../navigator-services-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedIterator,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(KeyboardLayoutMap);
}

export function installRelation() {
  installDispatchedRelation(
    KeyboardLayoutMap,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    KeyboardLayoutMap,
    "size",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    KeyboardLayoutMap,
    "entries",
    0,
    runtime.navigatorServiceOperation,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    KeyboardLayoutMap,
    "forEach",
    1,
    runtime.navigatorServiceOperation,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    KeyboardLayoutMap,
    "get",
    1,
    runtime.navigatorServiceOperation,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    KeyboardLayoutMap,
    "has",
    1,
    runtime.navigatorServiceOperation,
  );
}

export function installOwnedMember5() {
  installDispatchedMethod(
    KeyboardLayoutMap,
    "keys",
    0,
    runtime.navigatorServiceOperation,
  );
}

export function installOwnedMember6() {
  installDispatchedMethod(
    KeyboardLayoutMap,
    "values",
    0,
    runtime.navigatorServiceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(KeyboardLayoutMap);
}

export function installTag() {
  installDispatchedTag(KeyboardLayoutMap);
}

export function installIterator() {
  installDispatchedIterator(
    KeyboardLayoutMap,
    "entries",
    runtime.navigatorServiceIterator,
  );
}
