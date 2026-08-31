import * as runtime from "../performance-longtail-runtime.js";
import { LayoutShiftAttribution } from "../performance-longtail-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(LayoutShiftAttribution);
}

export function installRelation() {
  installDispatchedRelation(
    LayoutShiftAttribution,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    LayoutShiftAttribution,
    "node",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    LayoutShiftAttribution,
    "previousRect",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    LayoutShiftAttribution,
    "currentRect",
    runtime.performanceLongtailProperty,
    null,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedMethod(
    LayoutShiftAttribution,
    "toJSON",
    0,
    runtime.performanceLongtailOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(LayoutShiftAttribution);
}

export function installTag() {
  installDispatchedTag(LayoutShiftAttribution);
}
