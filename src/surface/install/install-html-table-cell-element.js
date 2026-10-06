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
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-members.js";

export function installHTMLTableCellElement() {
  installHTMLTableCellElementConstructor();
  accessor("colSpan", colSpan, setColSpan);
  accessor("rowSpan", rowSpan, setRowSpan);
  for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  definePrototypeGetter(HTMLTableCellElement.prototype, "cellIndex", cellIndex);
  for (const [name, entry] of booleanReflectionTable) accessor(name, entry.get, entry.set);
  defineConstructorBacklink(
    HTMLTableCellElement.prototype,
    HTMLTableCellElement,
  );
  defineToStringTag(HTMLTableCellElement.prototype, "HTMLTableCellElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLTableCellElement.prototype, name, getter, setter);
}
