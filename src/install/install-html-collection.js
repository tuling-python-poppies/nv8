import {
  finishHTMLCollectionConstructor,
  installHTMLCollectionConstructor,
} from "../api/dom/html-collection-constructor.js";
import {
  installHTMLCollectionItem,
} from "../api/dom/html-collection-item.js";
import {
  installHTMLCollectionLength,
} from "../api/dom/html-collection-length-getter.js";
import {
  installHTMLCollectionNamedItem,
} from "../api/dom/html-collection-named-item.js";
import {
  installHTMLCollectionIterator,
} from "../api/dom/html-collection-values.js";

export function installHTMLCollection() {
  installHTMLCollectionConstructor();
  installHTMLCollectionLength();
  installHTMLCollectionItem();
  installHTMLCollectionNamedItem();
  finishHTMLCollectionConstructor();
  installHTMLCollectionIterator();
}
