import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { cellIndex } from "../api/dom/html-table-cell-element-cell-index-getter.js";
import { colSpan, setColSpan } from "../api/dom/html-table-cell-element-col-span-property.js";
import {
  HTMLTableCellElement,
  installHTMLTableCellElementConstructor,
} from "../api/dom/html-table-cell-element-constructor.js";
import { rowSpan, setRowSpan } from "../api/dom/html-table-cell-element-row-span-property.js";
import {
  stringReflectionPart1Table,
  stringReflectionPart2Table,
  stringReflectionPart3Table,
} from "../api/dom/string-reflection-html-table-cell-element-members.js";
import { booleanReflectionTable } from "../api/dom/html-table-cell-element-no-wrap-property.js";

export function installHTMLTableCellElement() {
  installHTMLTableCellElementConstructor();
  accessor("colSpan", colSpan, setColSpan);
  accessor("rowSpan", rowSpan, setRowSpan);
  for (const [name, entry] of stringReflectionPart1Table) accessor(name, entry.get, entry.set);
  definePrototypeGetter(HTMLTableCellElement.prototype, "cellIndex", cellIndex);
  for (const [name, entry] of stringReflectionPart2Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of booleanReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of stringReflectionPart3Table) accessor(name, entry.get, entry.set);
  defineConstructorBacklink(
    HTMLTableCellElement.prototype,
    HTMLTableCellElement,
  );
  defineToStringTag(HTMLTableCellElement.prototype, "HTMLTableCellElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLTableCellElement.prototype, name, getter, setter);
}
