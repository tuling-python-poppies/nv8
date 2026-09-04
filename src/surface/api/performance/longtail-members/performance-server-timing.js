import * as runtime from "../performance-longtail-runtime.js";
import { PerformanceServerTiming } from "../performance-longtail-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PerformanceServerTiming);
}

export function installRelation() {
  installDispatchedRelation(
    PerformanceServerTiming,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    PerformanceServerTiming,
    "name",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    PerformanceServerTiming,
    "duration",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    PerformanceServerTiming,
    "description",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    PerformanceServerTiming,
    "toJSON",
    0,
    runtime.performanceLongtailOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PerformanceServerTiming);
}

export function installTag() {
  installDispatchedTag(PerformanceServerTiming);
}
