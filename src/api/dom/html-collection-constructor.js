import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

export function HTMLCollection() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLCollection, "HTMLCollection");

export function installHTMLCollectionConstructor() {
  delete HTMLCollection.prototype.constructor;
  defineGlobalConstructor("HTMLCollection", HTMLCollection);
}

export function finishHTMLCollectionConstructor() {
  defineConstructorBacklink(HTMLCollection.prototype, HTMLCollection);
  defineToStringTag(HTMLCollection.prototype, "HTMLCollection");
}
