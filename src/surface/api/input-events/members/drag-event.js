import { DragEvent } from "../input-events-runtime.js";
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
  installInputEventGlobal(DragEvent);
}

export function installRelation() {
  installInputEventRelation(
    DragEvent,
    INPUT_EVENT_SURFACES.DragEvent,
  );
}

export function installConstructorBacklink() {
  installInputEventConstructorBacklink(DragEvent);
}

export function installTag() {
  installInputEventTag(DragEvent);
}
