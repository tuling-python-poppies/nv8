import { ClipboardEvent } from "../input-events-runtime.js";
import { INPUT_EVENT_SURFACES } from "../input-events-surface.js";
import {
  installInputEventAccessor,
  installInputEventConstant,
  installInputEventConstructorBacklink,
  installInputEventGlobal,
  installInputEventIterator,
  installInputEventMethod,
  installInputEventRelation,
  installInputEventTag,
} from "../input-event-install-support.js";

export function installGlobal() {
  installInputEventGlobal(ClipboardEvent);
}

export function installRelation() {
  installInputEventRelation(
    ClipboardEvent,
    INPUT_EVENT_SURFACES.ClipboardEvent,
  );
}

export function installConstructorBacklink() {
  installInputEventConstructorBacklink(ClipboardEvent);
}

export function installTag() {
  installInputEventTag(ClipboardEvent);
}
