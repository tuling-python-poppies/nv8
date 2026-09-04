import * as runtime from "../general-events-runtime.js";
import { PopStateEvent } from "../general-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PopStateEvent);
}

export function installRelation() {
  installDispatchedRelation(
    PopStateEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PopStateEvent);
}

export function installTag() {
  installDispatchedTag(PopStateEvent);
}
