import * as runtime from "../dom-utilities-runtime.js";
import { CountQueuingStrategy } from "../dom-utilities-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(CountQueuingStrategy);
}

export function installRelation() {
  installDispatchedRelation(
    CountQueuingStrategy,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    CountQueuingStrategy,
    "highWaterMark",
    runtime.domUtilityProperty,
    null,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    CountQueuingStrategy,
    "size",
    runtime.domUtilityProperty,
    null,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(CountQueuingStrategy);
}

export function installTag() {
  installDispatchedTag(CountQueuingStrategy);
}
