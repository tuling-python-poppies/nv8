import { TouchEvent } from "../input-events-runtime.js";
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
  installInputEventGlobal(TouchEvent);
}

export function installRelation() {
  installInputEventRelation(
    TouchEvent,
    INPUT_EVENT_SURFACES.TouchEvent,
  );
}

export function installConstructorBacklink() {
  installInputEventConstructorBacklink(TouchEvent);
}

export function installTag() {
  installInputEventTag(TouchEvent);
}
