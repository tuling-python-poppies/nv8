import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { cells } from "../api/dom/html-table-row-element-cells-getter.js";
import {
  HTMLTableRowElement,
  installHTMLTableRowElementConstructor,
} from "../api/dom/html-table-row-element-constructor.js";
import { deleteCell } from "../api/dom/html-table-row-element-delete-cell.js";
import { insertCell } from "../api/dom/html-table-row-element-insert-cell.js";
import { rowIndex } from "../api/dom/html-table-row-element-row-index-getter.js";
import { sectionRowIndex } from "../api/dom/html-table-row-element-section-row-index-getter.js";
import { stringReflectionTable } from "../api/dom/string-reflection-html-table-row-element-members.js";

export function installHTMLTableRowElement() {
  installHTMLTableRowElementConstructor();
  definePrototypeGetter(HTMLTableRowElement.prototype, "rowIndex", rowIndex);
  definePrototypeGetter(
    HTMLTableRowElement.prototype,
    "sectionRowIndex",
    sectionRowIndex,
  );
  definePrototypeGetter(HTMLTableRowElement.prototype, "cells", cells);
  for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  definePrototypeMethod(
    HTMLTableRowElement.prototype,
    "deleteCell",
    deleteCell,
  );
  definePrototypeMethod(
    HTMLTableRowElement.prototype,
    "insertCell",
    insertCell,
  );
  defineConstructorBacklink(
    HTMLTableRowElement.prototype,
    HTMLTableRowElement,
  );
  defineToStringTag(HTMLTableRowElement.prototype, "HTMLTableRowElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLTableRowElement.prototype, name, getter, setter);
}
