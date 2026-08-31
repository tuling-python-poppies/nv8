import { TextEvent } from "../input-events-runtime.js";
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
  installInputEventGlobal(TextEvent);
}

export function installRelation() {
  installInputEventRelation(
    TextEvent,
    INPUT_EVENT_SURFACES.TextEvent,
  );
}

export function installConstructorBacklink() {
  installInputEventConstructorBacklink(TextEvent);
}

export function installTag() {
  installInputEventTag(TextEvent);
}
