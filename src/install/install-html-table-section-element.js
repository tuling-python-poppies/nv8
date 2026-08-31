import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import { align, setAlign } from "../api/dom/html-table-section-element-align-property.js";
import { ch, setCh } from "../api/dom/html-table-section-element-ch-property.js";
import { chOff, setChOff } from "../api/dom/html-table-section-element-ch-off-property.js";
import {
  HTMLTableSectionElement,
  installHTMLTableSectionElementConstructor,
} from "../api/dom/html-table-section-element-constructor.js";
import { deleteRow } from "../api/dom/html-table-section-element-delete-row.js";
import { insertRow } from "../api/dom/html-table-section-element-insert-row.js";
import { rows } from "../api/dom/html-table-section-element-rows-getter.js";
import { setVAlign, vAlign } from "../api/dom/html-table-section-element-v-align-property.js";

export function installHTMLTableSectionElement() {
  installHTMLTableSectionElementConstructor();
  definePrototypeGetter(HTMLTableSectionElement.prototype, "rows", rows);
  accessor("align", align, setAlign);
  accessor("ch", ch, setCh);
  accessor("chOff", chOff, setChOff);
  accessor("vAlign", vAlign, setVAlign);
  definePrototypeMethod(
    HTMLTableSectionElement.prototype,
    "deleteRow",
    deleteRow,
  );
  definePrototypeMethod(
    HTMLTableSectionElement.prototype,
    "insertRow",
    insertRow,
  );
  defineConstructorBacklink(
    HTMLTableSectionElement.prototype,
    HTMLTableSectionElement,
  );
  defineToStringTag(
    HTMLTableSectionElement.prototype,
    "HTMLTableSectionElement",
  );
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(
    HTMLTableSectionElement.prototype,
    name,
    getter,
    setter,
  );
}
