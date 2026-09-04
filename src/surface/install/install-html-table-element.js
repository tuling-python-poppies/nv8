import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { align, setAlign } from "../api/dom/html-table-element-align-property.js";
import { bgColor, setBgColor } from "../api/dom/html-table-element-bg-color-property.js";
import { border, setBorder } from "../api/dom/html-table-element-border-property.js";
import { caption, setCaption } from "../api/dom/html-table-element-caption-property.js";
import { cellPadding, setCellPadding } from "../api/dom/html-table-element-cell-padding-property.js";
import { cellSpacing, setCellSpacing } from "../api/dom/html-table-element-cell-spacing-property.js";
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
import { frame, setFrame } from "../api/dom/html-table-element-frame-property.js";
import { insertRow } from "../api/dom/html-table-element-insert-row.js";
import { rows } from "../api/dom/html-table-element-rows-getter.js";
import { rules, setRules } from "../api/dom/html-table-element-rules-property.js";
import { summary, setSummary } from "../api/dom/html-table-element-summary-property.js";
import { tBodies } from "../api/dom/html-table-element-t-bodies-getter.js";
import { setTFoot, tFoot } from "../api/dom/html-table-element-t-foot-property.js";
import { setTHead, tHead } from "../api/dom/html-table-element-t-head-property.js";
import { setWidth, width } from "../api/dom/html-table-element-width-property.js";

export function installHTMLTableElement() {
  installHTMLTableElementConstructor();
  accessor("caption", caption, setCaption);
  accessor("tHead", tHead, setTHead);
  accessor("tFoot", tFoot, setTFoot);
  definePrototypeGetter(HTMLTableElement.prototype, "tBodies", tBodies);
  definePrototypeGetter(HTMLTableElement.prototype, "rows", rows);
  accessor("align", align, setAlign);
  accessor("border", border, setBorder);
  accessor("frame", frame, setFrame);
  accessor("rules", rules, setRules);
  accessor("summary", summary, setSummary);
  accessor("width", width, setWidth);
  accessor("bgColor", bgColor, setBgColor);
  accessor("cellPadding", cellPadding, setCellPadding);
  accessor("cellSpacing", cellSpacing, setCellSpacing);
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
