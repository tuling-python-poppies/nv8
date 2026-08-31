import {
  defineConstructorBacklink,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { values } from "../api/dom/html-collection-values.js";
import {
  HTMLFormControlsCollection,
  installHTMLFormControlsCollectionConstructor,
} from "../api/dom/html-form-controls-collection-constructor.js";
import { namedItem } from "../api/dom/html-form-controls-collection-named-item.js";

export function installHTMLFormControlsCollection() {
  installHTMLFormControlsCollectionConstructor();
  definePrototypeMethod(
    HTMLFormControlsCollection.prototype,
    "namedItem",
    namedItem,
  );
  defineConstructorBacklink(
    HTMLFormControlsCollection.prototype,
    HTMLFormControlsCollection,
  );
  defineToStringTag(
    HTMLFormControlsCollection.prototype,
    "HTMLFormControlsCollection",
  );
  Object.defineProperty(
    HTMLFormControlsCollection.prototype,
    Symbol.iterator,
    {
      value: values,
      writable: true,
      enumerable: false,
      configurable: true,
    },
  );
}
