import {
  finishHTMLElementConstructor,
  finishHTMLElementToStringTag,
  HTMLElement,
  installHTMLElementConstructor,
} from "../api/dom/html-element-constructor.js";
import { definePrototypeAccessor, definePrototypeGetter, definePrototypeMethod } from "../../engine/webidl/descriptor.js";
import { translate, setTranslate } from "../api/dom/html-element-translate-property.js";
import { isContentEditable } from "../api/dom/html-element-is-content-editable-getter.js";
import { offsetParent } from "../api/dom/html-element-offset-parent-getter.js";
import { offsetTop } from "../api/dom/html-element-offset-top-getter.js";
import { offsetLeft } from "../api/dom/html-element-offset-left-getter.js";
import { offsetWidth } from "../api/dom/html-element-offset-width-getter.js";
import { offsetHeight } from "../api/dom/html-element-offset-height-getter.js";
import { popover, setPopover } from "../api/dom/html-element-popover-property.js";
import { innerText, setInnerText } from "../api/dom/html-element-inner-text-property.js";
import { outerText, setOuterText } from "../api/dom/html-element-outer-text-property.js";
import {
  installHTMLElementAfterConstructorEventMembers,
  installHTMLElementEarlyEventMembers,
  installHTMLElementLateEventMembers,
} from "../api/dom/html-element-event-members.js";
import { configureCSSPropertyNames } from "../api/css/css-style-declaration-properties.js";
import { htmlAutocorrect, setHTMLAutocorrect } from "../api/dom/html-element-state.js";
import { dataset } from "../api/dom/html-element-dataset-getter.js";
import { tabIndex, setTabIndex } from "../api/dom/html-element-tab-index-property.js";
import { style } from "../api/dom/html-element-style-getter.js";
import { attributeStyleMap } from "../api/dom/html-element-attribute-style-map-getter.js";
import { blur } from "../api/dom/html-element-blur.js";
import { click } from "../api/dom/html-element-click.js";
import { focus } from "../api/dom/html-element-focus.js";
import { togglePopover } from "../api/dom/html-element-toggle-popover.js";
import {
  htmlStringDescriptorPart1Table,
  htmlStringDescriptorPart2Table,
  htmlStringDescriptorPart3Table,
  htmlStringDescriptorPart4Table,
  htmlStringDescriptorPart5Table,
  htmlStringDescriptorPart6Table,
  htmlStringDescriptorPart7Table,
  htmlStringDescriptorPart8Table,
  htmlStringDescriptorPart9Table,
} from "../api/dom/html-string-descriptor-members.js";
import {
  htmlBooleanDescriptorPart1Table,
  htmlBooleanDescriptorPart2Table,
  htmlBooleanDescriptorPart3Table,
} from "../api/dom/html-boolean-descriptor-members.js";
import { htmlStateDescriptorTable } from "../api/dom/html-element-edit-context-property.js";
import {
  htmlElementMethodPart1Table,
  htmlElementMethodPart2Table,
} from "../api/dom/html-element-method-members.js";

export function installHTMLElement(browserMajorVersion = 150) {
  configureCSSPropertyNames(browserMajorVersion);
  installHTMLElementConstructor();
  for (const [name, entry] of htmlStringDescriptorPart1Table) accessor(name, entry.get, entry.set);
  accessor("translate", translate, setTranslate);
  for (const [name, entry] of htmlStringDescriptorPart2Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of htmlBooleanDescriptorPart1Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of htmlStringDescriptorPart3Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of htmlBooleanDescriptorPart2Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of htmlStringDescriptorPart4Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of htmlStateDescriptorTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of htmlStringDescriptorPart5Table) accessor(name, entry.get, entry.set);
  getter("isContentEditable", isContentEditable);
  for (const [name, entry] of htmlStringDescriptorPart6Table) accessor(name, entry.get, entry.set);
  getter("offsetParent", offsetParent);
  getter("offsetTop", offsetTop);
  getter("offsetLeft", offsetLeft);
  getter("offsetWidth", offsetWidth);
  getter("offsetHeight", offsetHeight);
  accessor("popover", popover, setPopover);
  accessor("innerText", innerText, setInnerText);
  accessor("outerText", outerText, setOuterText);
  for (const [name, entry] of htmlStringDescriptorPart7Table) accessor(name, entry.get, entry.set);
  installHTMLElementEarlyEventMembers(accessor);
  getter("dataset", dataset);
  for (const [name, entry] of htmlStringDescriptorPart8Table) accessor(name, entry.get, entry.set);
  for (const [name, entry] of htmlBooleanDescriptorPart3Table) accessor(name, entry.get, entry.set);
  accessor("tabIndex", tabIndex, setTabIndex);
  getter("style", style);
  getter("attributeStyleMap", attributeStyleMap);
  for (const [name, entry] of htmlElementMethodPart1Table) method(name, entry);
  method("blur", blur);
  method("click", click);
  method("focus", focus);
  for (const [name, entry] of htmlElementMethodPart2Table) method(name, entry);
  method("togglePopover", togglePopover);
  if (browserMajorVersion >= 154) {
    accessor(
      "autocorrect",
      function getAutocorrect() { return htmlAutocorrect(this); },
      function setAutocorrect(value) { setHTMLAutocorrect(this, value); },
    );
  }
  installHTMLElementLateEventMembers(accessor);
  for (const [name, entry] of htmlStringDescriptorPart9Table) accessor(name, entry.get, entry.set);
  finishHTMLElementConstructor();
  installHTMLElementAfterConstructorEventMembers(accessor);
  finishHTMLElementToStringTag();
}

function accessor(name, get, set) {
  definePrototypeAccessor(HTMLElement.prototype, name, get, set);
}

function getter(name, get) {
  definePrototypeGetter(HTMLElement.prototype, name, get);
}
function method(name, callback) {
  definePrototypeMethod(HTMLElement.prototype, name, callback);
}
