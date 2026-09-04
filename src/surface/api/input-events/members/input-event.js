import { InputEvent } from "../input-events-runtime.js";
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
  installInputEventGlobal(InputEvent);
}

export function installRelation() {
  installInputEventRelation(
    InputEvent,
    INPUT_EVENT_SURFACES.InputEvent,
  );
}

export function installConstructorBacklink() {
  installInputEventConstructorBacklink(InputEvent);
}

export function installTag() {
  installInputEventTag(InputEvent);
}
