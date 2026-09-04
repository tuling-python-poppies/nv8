import { DataTransfer } from "../input-events-runtime.js";
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
  installInputEventGlobal(DataTransfer);
}

export function installRelation() {
  installInputEventRelation(
    DataTransfer,
    INPUT_EVENT_SURFACES.DataTransfer,
  );
}

export function installOwnedMember0() {
  installInputEventAccessor(DataTransfer, "dropEffect");
}

export function installOwnedMember1() {
  installInputEventAccessor(DataTransfer, "effectAllowed");
}

export function installOwnedMember2() {
  installInputEventAccessor(DataTransfer, "items");
}

export function installOwnedMember3() {
  installInputEventAccessor(DataTransfer, "types");
}

export function installOwnedMember4() {
  installInputEventAccessor(DataTransfer, "files");
}

export function installOwnedMember5() {
  installInputEventMethod(DataTransfer, "clearData", 0);
}

export function installOwnedMember6() {
  installInputEventMethod(DataTransfer, "getData", 1);
}

export function installOwnedMember7() {
  installInputEventMethod(DataTransfer, "setData", 2);
}

export function installOwnedMember8() {
  installInputEventMethod(DataTransfer, "setDragImage", 3);
}

export function installConstructorBacklink() {
  installInputEventConstructorBacklink(DataTransfer);
}

export function installTag() {
  installInputEventTag(DataTransfer);
}
