import * as runtime from "../longtail-events-runtime.js";
import { ClipboardChangeEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(ClipboardChangeEvent);
}

export function installRelation() {
  installDispatchedRelation(
    ClipboardChangeEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(ClipboardChangeEvent);
}

export function installTag() {
  installDispatchedTag(ClipboardChangeEvent);
}
