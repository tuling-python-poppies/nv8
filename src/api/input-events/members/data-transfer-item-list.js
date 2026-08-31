import { DataTransferItemList } from "../input-events-runtime.js";
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
  installInputEventGlobal(DataTransferItemList);
}

export function installRelation() {
  installInputEventRelation(
    DataTransferItemList,
    INPUT_EVENT_SURFACES.DataTransferItemList,
  );
}

export function installOwnedMember0() {
  installInputEventAccessor(DataTransferItemList, "length");
}

export function installOwnedMember1() {
  installInputEventMethod(DataTransferItemList, "add", 1);
}

export function installOwnedMember2() {
  installInputEventMethod(DataTransferItemList, "clear", 0);
}

export function installOwnedMember3() {
  installInputEventMethod(DataTransferItemList, "remove", 1);
}

export function installConstructorBacklink() {
  installInputEventConstructorBacklink(DataTransferItemList);
}

export function installTag() {
  installInputEventTag(DataTransferItemList);
}

export function installIterator() {
  installInputEventIterator(DataTransferItemList, "values");
}
