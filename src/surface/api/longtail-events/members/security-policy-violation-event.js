import * as runtime from "../longtail-events-runtime.js";
import { SecurityPolicyViolationEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(SecurityPolicyViolationEvent);
}

export function installRelation() {
  installDispatchedRelation(
    SecurityPolicyViolationEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(SecurityPolicyViolationEvent);
}

export function installTag() {
  installDispatchedTag(SecurityPolicyViolationEvent);
}
