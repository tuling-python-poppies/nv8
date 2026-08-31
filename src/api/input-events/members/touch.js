import { Touch } from "../input-events-runtime.js";
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
  installInputEventGlobal(Touch);
}

export function installRelation() {
  installInputEventRelation(
    Touch,
    INPUT_EVENT_SURFACES.Touch,
  );
}

export function installOwnedMember0() {
  installInputEventAccessor(Touch, "identifier");
}

export function installOwnedMember1() {
  installInputEventAccessor(Touch, "target");
}

export function installOwnedMember2() {
  installInputEventAccessor(Touch, "screenX");
}

export function installOwnedMember3() {
  installInputEventAccessor(Touch, "screenY");
}

export function installOwnedMember4() {
  installInputEventAccessor(Touch, "clientX");
}

export function installOwnedMember5() {
  installInputEventAccessor(Touch, "clientY");
}

export function installOwnedMember6() {
  installInputEventAccessor(Touch, "pageX");
}

export function installOwnedMember7() {
  installInputEventAccessor(Touch, "pageY");
}

export function installOwnedMember8() {
  installInputEventAccessor(Touch, "radiusX");
}

export function installOwnedMember9() {
  installInputEventAccessor(Touch, "radiusY");
}

export function installOwnedMember10() {
  installInputEventAccessor(Touch, "rotationAngle");
}

export function installOwnedMember11() {
  installInputEventAccessor(Touch, "force");
}

export function installConstructorBacklink() {
  installInputEventConstructorBacklink(Touch);
}

export function installTag() {
  installInputEventTag(Touch);
}
