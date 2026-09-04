import { MouseEvent } from "../input-events-runtime.js";
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
  installInputEventGlobal(MouseEvent);
}

export function installRelation() {
  installInputEventRelation(
    MouseEvent,
    INPUT_EVENT_SURFACES.MouseEvent,
  );
}

export function installConstructorBacklink() {
  installInputEventConstructorBacklink(MouseEvent);
}

export function installTag() {
  installInputEventTag(MouseEvent);
}
