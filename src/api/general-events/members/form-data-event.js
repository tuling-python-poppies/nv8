import * as runtime from "../general-events-runtime.js";
import { FormDataEvent } from "../general-events-runtime.js";
import {
  installDispatchedConstructorBacklink,
  installDispatchedGlobal,
  installDispatchedRelation,
  installDispatchedTag,
} from "../../../webidl/dispatched-surface-install.js";

export function installGlobal() {
  installDispatchedGlobal(FormDataEvent);
}

export function installRelation() {
  installDispatchedRelation(
    FormDataEvent,
    "Event",
  );
}

export function installConstructorBacklink() {
  installDispatchedConstructorBacklink(FormDataEvent);
}

export function installTag() {
  installDispatchedTag(FormDataEvent);
}
