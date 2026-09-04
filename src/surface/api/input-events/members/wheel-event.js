import { WheelEvent } from "../input-events-runtime.js";
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
  installInputEventGlobal(WheelEvent);
}

export function installRelation() {
  installInputEventRelation(
    WheelEvent,
    INPUT_EVENT_SURFACES.WheelEvent,
  );
}

export function installConstant0() {
  installInputEventConstant(WheelEvent, "DOM_DELTA_PIXEL");
}

export function installConstant1() {
  installInputEventConstant(WheelEvent, "DOM_DELTA_LINE");
}

export function installConstant2() {
  installInputEventConstant(WheelEvent, "DOM_DELTA_PAGE");
}

export function installConstructorBacklink() {
  installInputEventConstructorBacklink(WheelEvent);
}

export function installTag() {
  installInputEventTag(WheelEvent);
}
