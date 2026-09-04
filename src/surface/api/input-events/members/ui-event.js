import { UIEvent } from "../input-events-runtime.js";
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
  installInputEventGlobal(UIEvent);
}

export function installRelation() {
  installInputEventRelation(
    UIEvent,
    INPUT_EVENT_SURFACES.UIEvent,
  );
}

export function installConstructorBacklink() {
  installInputEventConstructorBacklink(UIEvent);
}

export function installTag() {
  installInputEventTag(UIEvent);
}
