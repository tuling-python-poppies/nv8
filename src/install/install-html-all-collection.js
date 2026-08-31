import {
  definePrototypeGetter,
  definePrototypeMethod,
} from "../webidl/descriptor.js";
import {
  finishHTMLAllCollectionConstructor,
  HTMLAllCollection,
  installHTMLAllCollectionConstructor,
} from "../api/dom/html-all-collection-constructor.js";
import { item } from "../api/dom/html-all-collection-item.js";
import { length } from "../api/dom/html-all-collection-length-getter.js";
import {
  namedItem,
} from "../api/dom/html-all-collection-named-item.js";

export function installHTMLAllCollection() {
  installHTMLAllCollectionConstructor();
  definePrototypeGetter(HTMLAllCollection.prototype, "length", length);
  definePrototypeMethod(HTMLAllCollection.prototype, "item", item);
  definePrototypeMethod(
    HTMLAllCollection.prototype,
    "namedItem",
    namedItem,
  );
  finishHTMLAllCollectionConstructor();
  Object.defineProperty(HTMLAllCollection.prototype, Symbol.iterator, {
    value: Array.prototype.values,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}
