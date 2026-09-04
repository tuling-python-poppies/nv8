import * as runtime from "../general-events-runtime.js";
import { MediaQueryListEvent } from "../general-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(MediaQueryListEvent);
}

export function installRelation() {
  installDispatchedRelation(
    MediaQueryListEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(MediaQueryListEvent);
}

export function installTag() {
  installDispatchedTag(MediaQueryListEvent);
}
