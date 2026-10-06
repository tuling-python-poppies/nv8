import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { caption, setCaption } from "../api/dom/html-table-element-caption-property.js";
import {
  HTMLTableElement,
  installHTMLTableElementConstructor,
} from "../api/dom/html-table-element-constructor.js";
import { createCaption } from "../api/dom/html-table-element-create-caption.js";
import { createTBody } from "../api/dom/html-table-element-create-t-body.js";
import { createTFoot } from "../api/dom/html-table-element-create-t-foot.js";
import { createTHead } from "../api/dom/html-table-element-create-t-head.js";
import { deleteCaption } from "../api/dom/html-table-element-delete-caption.js";
import { deleteRow } from "../api/dom/html-table-element-delete-row.js";
import { deleteTFoot } from "../api/dom/html-table-element-delete-t-foot.js";
import { deleteTHead } from "../api/dom/html-table-element-delete-t-head.js";
import { insertRow } from "../api/dom/html-table-element-insert-row.js";
import { rows } from "../api/dom/html-table-element-rows-getter.js";
import { tBodies } from "../api/dom/html-table-element-t-bodies-getter.js";
import { setTFoot, tFoot } from "../api/dom/html-table-element-t-foot-property.js";
import { setTHead, tHead } from "../api/dom/html-table-element-t-head-property.js";
import { stringReflectionTable } from "../api/dom/string-reflection-members.js";

export function installHTMLTableElement() {
  installHTMLTableElementConstructor();
  accessor("caption", caption, setCaption);
  accessor("tHead", tHead, setTHead);
  accessor("tFoot", tFoot, setTFoot);
  definePrototypeGetter(HTMLTableElement.prototype, "tBodies", tBodies);
  definePrototypeGetter(HTMLTableElement.prototype, "rows", rows);
  for (const [name, entry] of stringReflectionTable) accessor(name, entry.get, entry.set);
  method("createCaption", createCaption);
  method("createTBody", createTBody);
  method("createTFoot", createTFoot);
  method("createTHead", createTHead);
  method("deleteCaption", deleteCaption);
  method("deleteRow", deleteRow);
  method("deleteTFoot", deleteTFoot);
  method("deleteTHead", deleteTHead);
  method("insertRow", insertRow);
  defineConstructorBacklink(HTMLTableElement.prototype, HTMLTableElement);
  defineToStringTag(HTMLTableElement.prototype, "HTMLTableElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLTableElement.prototype, name, getter, setter);
}

function method(name, callback) {
  definePrototypeMethod(HTMLTableElement.prototype, name, callback);
}
