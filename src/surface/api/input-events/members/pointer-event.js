import { PointerEvent } from "../input-events-runtime.js";
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
  installInputEventGlobal(PointerEvent);
}

export function installRelation() {
  installInputEventRelation(
    PointerEvent,
    INPUT_EVENT_SURFACES.PointerEvent,
  );
}

export function installConstructorBacklink() {
  installInputEventConstructorBacklink(PointerEvent);
}

export function installTag() {
  installInputEventTag(PointerEvent);
}
