import {
  defineConstructorBacklink,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  installStyleSheetListConstructor,
  StyleSheetList,
} from "../api/css/style-sheet-list-constructor.js";
import { length } from "../api/css/style-sheet-list-length-getter.js";
import { item } from "../api/css/style-sheet-list-item.js";
import { values } from "../api/css/style-sheet-list-values.js";

export function installStyleSheetList() {
  installStyleSheetListConstructor();
  definePrototypeGetter(StyleSheetList.prototype, "length", length);
  definePrototypeMethod(StyleSheetList.prototype, "item", item);
  defineConstructorBacklink(StyleSheetList.prototype, StyleSheetList);
  defineToStringTag(StyleSheetList.prototype, "StyleSheetList");
  definePrototypeMethod(
    StyleSheetList.prototype,
    Symbol.iterator,
    values,
    "values",
    false,
  );
}
