import * as runtime from "../longtail-events-runtime.js";
import { CommandEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(CommandEvent);
}

export function installRelation() {
  installDispatchedRelation(
    CommandEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(CommandEvent);
}

export function installTag() {
  installDispatchedTag(CommandEvent);
}
