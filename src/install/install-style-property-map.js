import {
  defineConstructorBacklink,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  installStylePropertyMapConstructor,
  StylePropertyMap,
} from "../api/css/style-property-map-constructor.js";
import { append } from "../api/css/style-property-map-append.js";
import { clear } from "../api/css/style-property-map-clear.js";
import { deleteProperty } from "../api/css/style-property-map-delete.js";
import { set } from "../api/css/style-property-map-set.js";

export function installStylePropertyMap() {
  installStylePropertyMapConstructor();
  definePrototypeMethod(StylePropertyMap.prototype, "append", append);
  definePrototypeMethod(StylePropertyMap.prototype, "clear", clear);
  definePrototypeMethod(StylePropertyMap.prototype, "delete", deleteProperty);
  definePrototypeMethod(StylePropertyMap.prototype, "set", set);
  defineConstructorBacklink(StylePropertyMap.prototype, StylePropertyMap);
  defineToStringTag(StylePropertyMap.prototype, "StylePropertyMap");
}
