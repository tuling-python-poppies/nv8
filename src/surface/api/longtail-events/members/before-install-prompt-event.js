import * as runtime from "../longtail-events-runtime.js";
import { BeforeInstallPromptEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(BeforeInstallPromptEvent);
}

export function installRelation() {
  installDispatchedRelation(
    BeforeInstallPromptEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(BeforeInstallPromptEvent);
}

export function installTag() {
  installDispatchedTag(BeforeInstallPromptEvent);
}
