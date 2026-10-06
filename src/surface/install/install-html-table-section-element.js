import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLTableSectionElement,
  installHTMLTableSectionElementConstructor,
} from "../api/dom/html-table-section-element-constructor.js";
import { deleteRow } from "../api/dom/html-table-section-element-delete-row.js";
import { insertRow } from "../api/dom/html-table-section-element-insert-row.js";
import { rows } from "../api/dom/html-table-section-element-rows-getter.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";

export function installHTMLTableSectionElement() {
  installHTMLTableSectionElementConstructor();
  definePrototypeGetter(HTMLTableSectionElement.prototype, "rows", rows);
  for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
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
