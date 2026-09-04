import { FocusEvent } from "../input-events-runtime.js";
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
  installInputEventGlobal(FocusEvent);
}

export function installRelation() {
  installInputEventRelation(
    FocusEvent,
    INPUT_EVENT_SURFACES.FocusEvent,
  );
}

export function installConstructorBacklink() {
  installInputEventConstructorBacklink(FocusEvent);
}

export function installTag() {
  installInputEventTag(FocusEvent);
}
