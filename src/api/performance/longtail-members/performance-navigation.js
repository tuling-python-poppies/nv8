import * as runtime from "../performance-longtail-runtime.js";
import { PerformanceNavigation } from "../performance-longtail-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstant,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PerformanceNavigation);
}

export function installRelation() {
  installDispatchedRelation(
    PerformanceNavigation,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    PerformanceNavigation,
    "type",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    PerformanceNavigation,
    "redirectCount",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installConstant0() {
  installDispatchedConstant(
    PerformanceNavigation,
    "TYPE_NAVIGATE",
    0,
  );
}

export function installConstant1() {
  installDispatchedConstant(
    PerformanceNavigation,
    "TYPE_RELOAD",
    1,
  );
}

export function installConstant2() {
  installDispatchedConstant(
    PerformanceNavigation,
    "TYPE_BACK_FORWARD",
    2,
  );
}

export function installConstant3() {
  installDispatchedConstant(
    PerformanceNavigation,
    "TYPE_RESERVED",
    255,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    PerformanceNavigation,
    "toJSON",
    0,
    runtime.performanceLongtailOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PerformanceNavigation);
}

export function installTag() {
  installDispatchedTag(PerformanceNavigation);
}
