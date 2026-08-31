import { DataTransferItem } from "../input-events-runtime.js";
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
  installInputEventGlobal(DataTransferItem);
}

export function installRelation() {
  installInputEventRelation(
    DataTransferItem,
    INPUT_EVENT_SURFACES.DataTransferItem,
  );
}

export function installOwnedMember0() {
  installInputEventAccessor(DataTransferItem, "kind");
}

export function installOwnedMember1() {
  installInputEventAccessor(DataTransferItem, "type");
}

export function installOwnedMember2() {
  installInputEventMethod(DataTransferItem, "getAsFile", 0);
}

export function installOwnedMember3() {
  installInputEventMethod(DataTransferItem, "getAsString", 1);
}

export function installOwnedMember4() {
  installInputEventMethod(DataTransferItem, "webkitGetAsEntry", 0);
}

export function installOwnedMember5() {
  installInputEventMethod(DataTransferItem, "getAsFileSystemHandle", 0);
}

export function installConstructorBacklink() {
  installInputEventConstructorBacklink(DataTransferItem);
}

export function installTag() {
  installInputEventTag(DataTransferItem);
}
