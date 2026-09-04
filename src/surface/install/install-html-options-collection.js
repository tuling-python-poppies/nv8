import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { values } from "../api/dom/html-collection-values.js";
import { add } from "../api/dom/html-options-collection-add.js";
import {
  HTMLOptionsCollection,
  installHTMLOptionsCollectionConstructor,
} from "../api/dom/html-options-collection-constructor.js";
import {
  length,
  setLength,
} from "../api/dom/html-options-collection-length-property.js";
import { remove } from "../api/dom/html-options-collection-remove.js";
import {
  selectedIndex,
  setSelectedIndex,
} from "../api/dom/html-options-collection-selected-index-property.js";

export function installHTMLOptionsCollection() {
  installHTMLOptionsCollectionConstructor();
  definePrototypeAccessor(
    HTMLOptionsCollection.prototype,
    "length",
    length,
    setLength,
  );
  definePrototypeAccessor(
    HTMLOptionsCollection.prototype,
    "selectedIndex",
    selectedIndex,
    setSelectedIndex,
  );
  definePrototypeMethod(HTMLOptionsCollection.prototype, "add", add);
  definePrototypeMethod(HTMLOptionsCollection.prototype, "remove", remove);
  defineConstructorBacklink(
    HTMLOptionsCollection.prototype,
    HTMLOptionsCollection,
  );
  defineToStringTag(
    HTMLOptionsCollection.prototype,
    "HTMLOptionsCollection",
  );
  Object.defineProperty(HTMLOptionsCollection.prototype, Symbol.iterator, {
    value: values,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}
