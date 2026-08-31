import * as runtime from "../navigator-services-runtime.js";
import { NetworkInformation } from "../navigator-services-runtime.js";
import { EventTarget as __ExplicitParent } from "../../event/event-target-constructor.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(NetworkInformation);
}

export function installRelation() {
  installDispatchedRelation(
    NetworkInformation,
    "EventTarget",
    __ExplicitParent,
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(NetworkInformation);
}

export function installTag() {
  installDispatchedTag(NetworkInformation);
}
