import * as runtime from "../navigator-services-runtime.js";
import { MimeType } from "../navigator-services-runtime.js";
import {
  installDispatchedAccessor,
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MimeType);
}

export function installRelation() {
  installDispatchedRelation(
    MimeType,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedAccessor(
    MimeType,
    "type",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}

export function installOwnedMember1() {
  installDispatchedAccessor(
    MimeType,
    "suffixes",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}

export function installOwnedMember2() {
  installDispatchedAccessor(
    MimeType,
    "description",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}

export function installOwnedMember3() {
  installDispatchedAccessor(
    MimeType,
    "enabledPlugin",
    runtime.navigatorServiceProperty,
    runtime.setNavigatorServiceProperty,
    false,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MimeType);
}

export function installTag() {
  installDispatchedTag(MimeType);
}
