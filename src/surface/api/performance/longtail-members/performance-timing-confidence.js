import * as runtime from "../performance-longtail-runtime.js";
import { PerformanceTimingConfidence } from "../performance-longtail-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PerformanceTimingConfidence);
}

export function installRelation() {
  installDispatchedRelation(
    PerformanceTimingConfidence,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    PerformanceTimingConfidence,
    "randomizedTriggerRate",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    PerformanceTimingConfidence,
    "value",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedMethod(
    PerformanceTimingConfidence,
    "toJSON",
    0,
    runtime.performanceLongtailOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PerformanceTimingConfidence);
}

export function installTag() {
  installDispatchedTag(PerformanceTimingConfidence);
}
