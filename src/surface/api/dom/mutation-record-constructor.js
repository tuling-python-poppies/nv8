import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function MutationRecord() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(MutationRecord, "MutationRecord");

export function installMutationRecordConstructor() {
  delete MutationRecord.prototype.constructor;
  defineGlobalConstructor("MutationRecord", MutationRecord);
}

export function finishMutationRecordConstructor() {
  defineConstructorBacklink(MutationRecord.prototype, MutationRecord);
  defineToStringTag(MutationRecord.prototype, "MutationRecord");
}
