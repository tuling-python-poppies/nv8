import * as runtime from "../longtail-events-runtime.js";
import { IDBVersionChangeEvent } from "../longtail-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../../engine/webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(IDBVersionChangeEvent);
}

export function installRelation() {
  installDispatchedRelation(
    IDBVersionChangeEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(IDBVersionChangeEvent);
}

export function installTag() {
  installDispatchedTag(IDBVersionChangeEvent);
}
