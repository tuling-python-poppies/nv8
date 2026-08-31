import { KeyboardEvent } from "../input-events-runtime.js";
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
  installInputEventGlobal(KeyboardEvent);
}

export function installRelation() {
  installInputEventRelation(
    KeyboardEvent,
    INPUT_EVENT_SURFACES.KeyboardEvent,
  );
}

export function installConstant0() {
  installInputEventConstant(KeyboardEvent, "DOM_KEY_LOCATION_STANDARD");
}

export function installConstant1() {
  installInputEventConstant(KeyboardEvent, "DOM_KEY_LOCATION_LEFT");
}

export function installConstant2() {
  installInputEventConstant(KeyboardEvent, "DOM_KEY_LOCATION_RIGHT");
}

export function installConstant3() {
  installInputEventConstant(KeyboardEvent, "DOM_KEY_LOCATION_NUMPAD");
}

export function installConstructorBacklink() {
  installInputEventConstructorBacklink(KeyboardEvent);
}

export function installTag() {
  installInputEventTag(KeyboardEvent);
}
