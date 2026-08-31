import { traceGetter } from "../../trace/trace-accessor.js";
import { definePrototypeGetter } from "../../webidl/descriptor.js";
import { registerNativeGetter } from "../../webidl/native-function.js";
import { HTMLCollection } from "./html-collection-constructor.js";
import { refreshHTMLCollection } from "./html-collection-state.js";

export const length = Object.getOwnPropertyDescriptor({
  get length() {
    const value = refreshHTMLCollection(this).length;
    traceGetter("window.HTMLCollection.prototype.length", "HTMLCollection", value);
    return value;
  },
}, "length").get;
registerNativeGetter(length, "length");
export function installHTMLCollectionLength() {
  definePrototypeGetter(HTMLCollection.prototype, "length", length);
}
