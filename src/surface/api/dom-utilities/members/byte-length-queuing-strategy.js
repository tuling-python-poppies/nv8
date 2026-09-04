import * as runtime from "../dom-utilities-runtime.js";
import { ByteLengthQueuingStrategy } from "../dom-utilities-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(ByteLengthQueuingStrategy);
}

export function installRelation() {
  installDispatchedRelation(
    ByteLengthQueuingStrategy,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    ByteLengthQueuingStrategy,
    "highWaterMark",
    runtime.domUtilityProperty,
    null,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    ByteLengthQueuingStrategy,
    "size",
    runtime.domUtilityProperty,
    null,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(ByteLengthQueuingStrategy);
}

export function installTag() {
  installDispatchedTag(ByteLengthQueuingStrategy);
}
