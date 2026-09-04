import * as runtime from "../navigator-services-runtime.js";
import { PluginArray } from "../navigator-services-runtime.js";
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
  installDispatchedGlobal(PluginArray);
}

export function installRelation() {
  installDispatchedRelation(
    PluginArray,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    PluginArray,
    "length",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    PluginArray,
    "item",
    1,
    runtime.navigatorServiceOperation,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    PluginArray,
    "namedItem",
    1,
    runtime.navigatorServiceOperation,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    PluginArray,
    "refresh",
    0,
    runtime.navigatorServiceOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PluginArray);
}

export function installTag() {
  installDispatchedTag(PluginArray);
}

export function installIterator() {
  installDispatchedIterator(
    PluginArray,
    "values",
    runtime.navigatorServiceIterator,
  );
}
