import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { installStyleSheetConstructor, StyleSheet } from "../api/css/style-sheet-constructor.js";
import { type } from "../api/css/style-sheet-type-getter.js";
import { href } from "../api/css/style-sheet-href-getter.js";
import { ownerNode } from "../api/css/style-sheet-owner-node-getter.js";
import { parentStyleSheet } from "../api/css/style-sheet-parent-style-sheet-getter.js";
import { title } from "../api/css/style-sheet-title-getter.js";
import { media } from "../api/css/style-sheet-media-property.js";
import { disabled } from "../api/css/style-sheet-disabled-property.js";

export function installStyleSheet() {
  installStyleSheetConstructor();
  definePrototypeGetter(StyleSheet.prototype, "type", type);
  definePrototypeGetter(StyleSheet.prototype, "href", href);
  definePrototypeGetter(StyleSheet.prototype, "ownerNode", ownerNode);
  definePrototypeGetter(StyleSheet.prototype, "parentStyleSheet", parentStyleSheet);
  definePrototypeGetter(StyleSheet.prototype, "title", title);
  definePrototypeAccessor(StyleSheet.prototype, "media", media.get, media.set);
  definePrototypeAccessor(StyleSheet.prototype, "disabled", disabled.get, disabled.set);
  defineConstructorBacklink(StyleSheet.prototype, StyleSheet);
  defineToStringTag(StyleSheet.prototype, "StyleSheet");
}
