import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { abbr, setAbbr } from "../api/dom/html-table-cell-element-abbr-property.js";
import { align, setAlign } from "../api/dom/html-table-cell-element-align-property.js";
import { axis, setAxis } from "../api/dom/html-table-cell-element-axis-property.js";
import { bgColor, setBgColor } from "../api/dom/html-table-cell-element-bg-color-property.js";
import { cellIndex } from "../api/dom/html-table-cell-element-cell-index-getter.js";
import { ch, setCh } from "../api/dom/html-table-cell-element-ch-property.js";
import { chOff, setChOff } from "../api/dom/html-table-cell-element-ch-off-property.js";
import { colSpan, setColSpan } from "../api/dom/html-table-cell-element-col-span-property.js";
import {
  HTMLTableCellElement,
  installHTMLTableCellElementConstructor,
} from "../api/dom/html-table-cell-element-constructor.js";
import { headers, setHeaders } from "../api/dom/html-table-cell-element-headers-property.js";
import { height, setHeight } from "../api/dom/html-table-cell-element-height-property.js";
import { noWrap, setNoWrap } from "../api/dom/html-table-cell-element-no-wrap-property.js";
import { rowSpan, setRowSpan } from "../api/dom/html-table-cell-element-row-span-property.js";
import { scope, setScope } from "../api/dom/html-table-cell-element-scope-property.js";
import { setVAlign, vAlign } from "../api/dom/html-table-cell-element-v-align-property.js";
import { setWidth, width } from "../api/dom/html-table-cell-element-width-property.js";

export function installHTMLTableCellElement() {
  installHTMLTableCellElementConstructor();
  accessor("colSpan", colSpan, setColSpan);
  accessor("rowSpan", rowSpan, setRowSpan);
  accessor("headers", headers, setHeaders);
  definePrototypeGetter(HTMLTableCellElement.prototype, "cellIndex", cellIndex);
  accessor("align", align, setAlign);
  accessor("axis", axis, setAxis);
  accessor("height", height, setHeight);
  accessor("width", width, setWidth);
  accessor("ch", ch, setCh);
  accessor("chOff", chOff, setChOff);
  accessor("noWrap", noWrap, setNoWrap);
  accessor("vAlign", vAlign, setVAlign);
  accessor("bgColor", bgColor, setBgColor);
  accessor("abbr", abbr, setAbbr);
  accessor("scope", scope, setScope);
  defineConstructorBacklink(
    HTMLTableCellElement.prototype,
    HTMLTableCellElement,
  );
  defineToStringTag(HTMLTableCellElement.prototype, "HTMLTableCellElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLTableCellElement.prototype, name, getter, setter);
}
