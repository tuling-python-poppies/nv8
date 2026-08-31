import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { align, setAlign } from "../api/dom/html-table-row-element-align-property.js";
import { bgColor, setBgColor } from "../api/dom/html-table-row-element-bg-color-property.js";
import { cells } from "../api/dom/html-table-row-element-cells-getter.js";
import { ch, setCh } from "../api/dom/html-table-row-element-ch-property.js";
import { chOff, setChOff } from "../api/dom/html-table-row-element-ch-off-property.js";
import {
  HTMLTableRowElement,
  installHTMLTableRowElementConstructor,
} from "../api/dom/html-table-row-element-constructor.js";
import { deleteCell } from "../api/dom/html-table-row-element-delete-cell.js";
import { insertCell } from "../api/dom/html-table-row-element-insert-cell.js";
import { rowIndex } from "../api/dom/html-table-row-element-row-index-getter.js";
import { sectionRowIndex } from "../api/dom/html-table-row-element-section-row-index-getter.js";
import { setVAlign, vAlign } from "../api/dom/html-table-row-element-v-align-property.js";

export function installHTMLTableRowElement() {
  installHTMLTableRowElementConstructor();
  definePrototypeGetter(HTMLTableRowElement.prototype, "rowIndex", rowIndex);
  definePrototypeGetter(
    HTMLTableRowElement.prototype,
    "sectionRowIndex",
    sectionRowIndex,
  );
  definePrototypeGetter(HTMLTableRowElement.prototype, "cells", cells);
  accessor("align", align, setAlign);
  accessor("ch", ch, setCh);
  accessor("chOff", chOff, setChOff);
  accessor("vAlign", vAlign, setVAlign);
  accessor("bgColor", bgColor, setBgColor);
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
