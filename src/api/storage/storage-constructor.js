import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

export function Storage() {
  throw new TypeError("Failed to construct 'Storage': Illegal constructor");
}

registerNativeFunction(Storage, "Storage");

export function installStorageConstructor() {
  delete Storage.prototype.constructor;
  defineToStringTag(Storage.prototype, "Storage");
  defineGlobalConstructor("Storage", Storage);
}

export function installStorageConstructorBacklink() {
  defineConstructorBacklink(Storage.prototype, Storage);
}
