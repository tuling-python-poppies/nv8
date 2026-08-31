import { registerNativeFunction } from "../../webidl/native-function.js";
import { HTMLCollection } from "./html-collection-constructor.js";
import { refreshHTMLCollection } from "./html-collection-state.js";

export const values = {
  values() {
    return refreshHTMLCollection(this)[Symbol.iterator]();
  },
}.values;
registerNativeFunction(values, "values");

export function installHTMLCollectionIterator() {
  Object.defineProperty(HTMLCollection.prototype, Symbol.iterator, {
    value: values,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}
