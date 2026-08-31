import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { Node } from "./node-constructor.js";

export function CharacterData() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(CharacterData, "CharacterData");

export function installCharacterDataConstructor() {
  Object.setPrototypeOf(CharacterData.prototype, Node.prototype);
  Object.setPrototypeOf(CharacterData, Node);
  delete CharacterData.prototype.constructor;
  defineGlobalConstructor("CharacterData", CharacterData);
}

export function finishCharacterDataConstructor() {
  defineConstructorBacklink(CharacterData.prototype, CharacterData);
  defineToStringTag(CharacterData.prototype, "CharacterData");
  Object.defineProperty(CharacterData.prototype, Symbol.unscopables, {
    value: Object.freeze({
      after: true,
      before: true,
      remove: true,
      replaceWith: true,
    }),
    writable: false,
    enumerable: false,
    configurable: true,
  });
}
