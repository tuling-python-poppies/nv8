import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

export function HTMLAllCollection() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLAllCollection, "HTMLAllCollection");

export function installHTMLAllCollectionConstructor() {
  delete HTMLAllCollection.prototype.constructor;
  defineGlobalConstructor("HTMLAllCollection", HTMLAllCollection);
}

export function finishHTMLAllCollectionConstructor() {
  defineConstructorBacklink(
    HTMLAllCollection.prototype,
    HTMLAllCollection,
  );
  defineToStringTag(HTMLAllCollection.prototype, "HTMLAllCollection");
}
