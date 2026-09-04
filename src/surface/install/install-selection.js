import { defineGlobalFunction, definePrototypeGetter, definePrototypeMethod } from "../../engine/webidl/descriptor.js";
import { addRange } from "../api/dom/selection-add-range.js";
import { anchorNode } from "../api/dom/selection-anchor-node-getter.js";
import { anchorOffset } from "../api/dom/selection-anchor-offset-getter.js";
import { baseNode } from "../api/dom/selection-base-node-getter.js";
import { baseOffset } from "../api/dom/selection-base-offset-getter.js";
import { collapse } from "../api/dom/selection-collapse.js";
import { collapseToEnd } from "../api/dom/selection-collapse-to-end.js";
import { collapseToStart } from "../api/dom/selection-collapse-to-start.js";
import {
  finishSelectionConstructor,
  installSelectionConstructor,
  Selection,
} from "../api/dom/selection-constructor.js";
import { containsNode } from "../api/dom/selection-contains-node.js";
import { deleteFromDocument } from "../api/dom/selection-delete-from-document.js";
import { direction } from "../api/dom/selection-direction-getter.js";
import { empty } from "../api/dom/selection-empty.js";
import { extend } from "../api/dom/selection-extend.js";
import { extentNode } from "../api/dom/selection-extent-node-getter.js";
import { extentOffset } from "../api/dom/selection-extent-offset-getter.js";
import { focusNode } from "../api/dom/selection-focus-node-getter.js";
import { focusOffset } from "../api/dom/selection-focus-offset-getter.js";
import { getComposedRanges } from "../api/dom/selection-get-composed-ranges.js";
import { getRangeAt } from "../api/dom/selection-get-range-at.js";
import { isCollapsed } from "../api/dom/selection-is-collapsed-getter.js";
import { modify } from "../api/dom/selection-modify.js";
import { rangeCount } from "../api/dom/selection-range-count-getter.js";
import { removeAllRanges } from "../api/dom/selection-remove-all-ranges.js";
import { removeRange } from "../api/dom/selection-remove-range.js";
import { selectAllChildrenCallback } from "../api/dom/selection-select-all-children.js";
import { setBaseAndExtent } from "../api/dom/selection-set-base-and-extent.js";
import { setPosition } from "../api/dom/selection-set-position.js";
import { toString } from "../api/dom/selection-to-string.js";
import { type } from "../api/dom/selection-type-getter.js";
import { getSelection as windowGetSelection } from "../api/dom/window-get-selection.js";

export function installSelection() {
  installSelectionConstructor();
  definePrototypeGetter(Selection.prototype, "anchorNode", anchorNode);
  definePrototypeGetter(Selection.prototype, "anchorOffset", anchorOffset);
  definePrototypeGetter(Selection.prototype, "focusNode", focusNode);
  definePrototypeGetter(Selection.prototype, "focusOffset", focusOffset);
  definePrototypeGetter(Selection.prototype, "isCollapsed", isCollapsed);
  definePrototypeGetter(Selection.prototype, "rangeCount", rangeCount);
  definePrototypeGetter(Selection.prototype, "type", type);
  definePrototypeGetter(Selection.prototype, "direction", direction);
  definePrototypeGetter(Selection.prototype, "baseNode", baseNode);
  definePrototypeGetter(Selection.prototype, "baseOffset", baseOffset);
  definePrototypeGetter(Selection.prototype, "extentNode", extentNode);
  definePrototypeGetter(Selection.prototype, "extentOffset", extentOffset);
  definePrototypeMethod(Selection.prototype, "addRange", addRange);
  definePrototypeMethod(Selection.prototype, "collapse", collapse);
  definePrototypeMethod(Selection.prototype, "collapseToEnd", collapseToEnd);
  definePrototypeMethod(Selection.prototype, "collapseToStart", collapseToStart);
  definePrototypeMethod(Selection.prototype, "containsNode", containsNode);
  definePrototypeMethod(Selection.prototype, "deleteFromDocument", deleteFromDocument);
  definePrototypeMethod(Selection.prototype, "empty", empty);
  definePrototypeMethod(Selection.prototype, "extend", extend);
  definePrototypeMethod(Selection.prototype, "getComposedRanges", getComposedRanges);
  definePrototypeMethod(Selection.prototype, "getRangeAt", getRangeAt);
  definePrototypeMethod(Selection.prototype, "modify", modify);
  definePrototypeMethod(Selection.prototype, "removeAllRanges", removeAllRanges);
  definePrototypeMethod(Selection.prototype, "removeRange", removeRange);
  definePrototypeMethod(Selection.prototype, "selectAllChildren", selectAllChildrenCallback);
  definePrototypeMethod(Selection.prototype, "setBaseAndExtent", setBaseAndExtent);
  definePrototypeMethod(Selection.prototype, "setPosition", setPosition);
  definePrototypeMethod(Selection.prototype, "toString", toString);
  finishSelectionConstructor();
  defineGlobalFunction("getSelection", windowGetSelection);
}
