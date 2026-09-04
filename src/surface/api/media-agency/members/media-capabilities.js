import * as runtime from "../media-agency-runtime.js";
import { MediaCapabilities } from "../media-agency-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedMethod,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MediaCapabilities);
}

export function installRelation() {
  installDispatchedRelation(
    MediaCapabilities,
    "Object",
    null,
  );
}

export function installOwnedMember0() {
  installDispatchedMethod(
    MediaCapabilities,
    "decodingInfo",
    1,
    runtime.mediaAgencyOperation,
  );
}

export function installOwnedMember1() {
  installDispatchedMethod(
    MediaCapabilities,
    "encodingInfo",
    1,
    runtime.mediaAgencyOperation,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MediaCapabilities);
}

export function installTag() {
  installDispatchedTag(MediaCapabilities);
}
