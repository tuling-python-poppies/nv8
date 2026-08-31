import * as runtime from "../longtail-events-runtime.js";
import { PageSwapEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(PageSwapEvent);
}

export function installRelation() {
  installDispatchedRelation(
    PageSwapEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(PageSwapEvent);
}

export function installTag() {
  installDispatchedTag(PageSwapEvent);
}
