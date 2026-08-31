import { TouchList } from "../input-events-runtime.js";
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
  installInputEventGlobal(TouchList);
}

export function installRelation() {
  installInputEventRelation(
    TouchList,
    INPUT_EVENT_SURFACES.TouchList,
  );
}

export function installOwnedMember0() {
  installInputEventAccessor(TouchList, "length");
}

export function installOwnedMember1() {
  installInputEventMethod(TouchList, "item", 1);
}

export function installConstructorBacklink() {
  installInputEventConstructorBacklink(TouchList);
}

export function installTag() {
  installInputEventTag(TouchList);
}

export function installIterator() {
  installInputEventIterator(TouchList, "values");
}
