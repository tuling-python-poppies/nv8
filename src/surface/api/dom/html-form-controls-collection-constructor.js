import { defineGlobalConstructor } from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { HTMLCollection } from "./html-collection-constructor.js";

export function HTMLFormControlsCollection() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(
  HTMLFormControlsCollection,
  "HTMLFormControlsCollection",
);

export function installHTMLFormControlsCollectionConstructor() {
  Object.setPrototypeOf(
    HTMLFormControlsCollection.prototype,
    HTMLCollection.prototype,
  );
  Object.setPrototypeOf(HTMLFormControlsCollection, HTMLCollection);
  delete HTMLFormControlsCollection.prototype.constructor;
  defineGlobalConstructor(
    "HTMLFormControlsCollection",
    HTMLFormControlsCollection,
  );
}
