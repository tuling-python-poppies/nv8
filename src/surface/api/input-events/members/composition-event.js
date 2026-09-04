import { CompositionEvent } from "../input-events-runtime.js";
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
  installInputEventGlobal(CompositionEvent);
}

export function installRelation() {
  installInputEventRelation(
    CompositionEvent,
    INPUT_EVENT_SURFACES.CompositionEvent,
  );
}

export function installConstructorBacklink() {
  installInputEventConstructorBacklink(CompositionEvent);
}

export function installTag() {
  installInputEventTag(CompositionEvent);
}
