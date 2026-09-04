import * as runtime from "../navigator-services-runtime.js";
import { Plugin } from "../navigator-services-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedIterator,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(Plugin);
}

export function installRelation() {
  installDispatchedRelation(
    Plugin,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    Plugin,
    "name",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    Plugin,
    "filename",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    Plugin,
    "description",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    Plugin,
    "length",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}

export function installOwnedMember4() {
  installDispatchedMethod(
    Plugin,
    "item",
    1,
    runtime.navigatorServiceOperation,
  );
}

export function installOwnedMember5() {
  installDispatchedMethod(
    Plugin,
    "namedItem",
    1,
    runtime.navigatorServiceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(Plugin);
}

export function installTag() {
  installDispatchedTag(Plugin);
}

export function installIterator() {
  installDispatchedIterator(
    Plugin,
    "values",
    runtime.navigatorServiceIterator,
  );
}
