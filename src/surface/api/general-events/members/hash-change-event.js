import * as runtime from "../general-events-runtime.js";
import { HashChangeEvent } from "../general-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(HashChangeEvent);
}

export function installRelation() {
  installDispatchedRelation(
    HashChangeEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(HashChangeEvent);
}

export function installTag() {
  installDispatchedTag(HashChangeEvent);
}
