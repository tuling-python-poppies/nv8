import * as runtime from "../navigator-services-runtime.js";
import { BarProp } from "../navigator-services-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(BarProp);
}

export function installRelation() {
  installDispatchedRelation(
    BarProp,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    BarProp,
    "visible",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(BarProp);
}

export function installTag() {
  installDispatchedTag(BarProp);
}
