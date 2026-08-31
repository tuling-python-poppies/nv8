import { defineGlobalConstructor } from "../../webidl/descriptor.js";
import { registerNativeFunction } from "../../webidl/native-function.js";
import { HTMLCollection } from "./html-collection-constructor.js";

export function HTMLOptionsCollection() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLOptionsCollection, "HTMLOptionsCollection");

export function installHTMLOptionsCollectionConstructor() {
  Object.setPrototypeOf(
    HTMLOptionsCollection.prototype,
    HTMLCollection.prototype,
  );
  Object.setPrototypeOf(HTMLOptionsCollection, HTMLCollection);
  delete HTMLOptionsCollection.prototype.constructor;
  defineGlobalConstructor("HTMLOptionsCollection", HTMLOptionsCollection);
}
