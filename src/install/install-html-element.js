import {
  finishHTMLElementConstructor,
  finishHTMLElementToStringTag,
  HTMLElement,
  installHTMLElementConstructor,
} from "../api/dom/html-element-constructor.js";
import { definePrototypeAccessor, definePrototypeGetter, definePrototypeMethod } from "../webidl/descriptor.js";
import { title, setTitle } from "../api/dom/html-element-title-property.js";
import { lang, setLang } from "../api/dom/html-element-lang-property.js";
import { translate, setTranslate } from "../api/dom/html-element-translate-property.js";
import { dir, setDir } from "../api/dom/html-element-dir-property.js";
import { hidden, setHidden } from "../api/dom/html-element-hidden-property.js";
import { inert, setInert } from "../api/dom/html-element-inert-property.js";
import { accessKey, setAccessKey } from "../api/dom/html-element-access-key-property.js";
import { draggable, setDraggable } from "../api/dom/html-element-draggable-property.js";
import { spellcheck, setSpellcheck } from "../api/dom/html-element-spellcheck-property.js";
import { autocapitalize, setAutocapitalize } from "../api/dom/html-element-autocapitalize-property.js";
import { editContext, setEditContext } from "../api/dom/html-element-edit-context-property.js";
import { contentEditable, setContentEditable } from "../api/dom/html-element-content-editable-property.js";
import { enterKeyHint, setEnterKeyHint } from "../api/dom/html-element-enter-key-hint-property.js";
import { isContentEditable } from "../api/dom/html-element-is-content-editable-getter.js";
import { inputMode, setInputMode } from "../api/dom/html-element-input-mode-property.js";
import { virtualKeyboardPolicy, setVirtualKeyboardPolicy } from "../api/dom/html-element-virtual-keyboard-policy-property.js";
import { offsetParent } from "../api/dom/html-element-offset-parent-getter.js";
import { offsetTop } from "../api/dom/html-element-offset-top-getter.js";
import { offsetLeft } from "../api/dom/html-element-offset-left-getter.js";
import { offsetWidth } from "../api/dom/html-element-offset-width-getter.js";
import { offsetHeight } from "../api/dom/html-element-offset-height-getter.js";
import { popover, setPopover } from "../api/dom/html-element-popover-property.js";
import { innerText, setInnerText } from "../api/dom/html-element-inner-text-property.js";
import { outerText, setOuterText } from "../api/dom/html-element-outer-text-property.js";
import { writingSuggestions, setWritingSuggestions } from "../api/dom/html-element-writing-suggestions-property.js";
import {
  installHTMLElementAfterConstructorEventMembers,
  installHTMLElementEarlyEventMembers,
  installHTMLElementLateEventMembers,
} from "../api/dom/html-element-event-members.js";
import { dataset } from "../api/dom/html-element-dataset-getter.js";
import { nonce, setNonce } from "../api/dom/html-element-nonce-property.js";
import { autofocus, setAutofocus } from "../api/dom/html-element-autofocus-property.js";
import { tabIndex, setTabIndex } from "../api/dom/html-element-tab-index-property.js";
import { style } from "../api/dom/html-element-style-getter.js";
import { attributeStyleMap } from "../api/dom/html-element-attribute-style-map-getter.js";
import { attachInternals } from "../api/dom/html-element-attach-internals.js";
import { blur } from "../api/dom/html-element-blur.js";
import { click } from "../api/dom/html-element-click.js";
import { focus } from "../api/dom/html-element-focus.js";
import { hidePopover } from "../api/dom/html-element-hide-popover.js";
import { showPopover } from "../api/dom/html-element-show-popover.js";
import { togglePopover } from "../api/dom/html-element-toggle-popover.js";
import { focusGroup, setFocusGroup } from "../api/dom/html-element-focus-group-property.js";
import { focusGroupStart, setFocusGroupStart } from "../api/dom/html-element-focus-group-start-property.js";

export function installHTMLElement() {
  installHTMLElementConstructor();
  accessor("title", title, setTitle);
  accessor("lang", lang, setLang);
  accessor("translate", translate, setTranslate);
  accessor("dir", dir, setDir);
  accessor("hidden", hidden, setHidden);
  accessor("inert", inert, setInert);
  accessor("accessKey", accessKey, setAccessKey);
  accessor("draggable", draggable, setDraggable);
  accessor("spellcheck", spellcheck, setSpellcheck);
  accessor("autocapitalize", autocapitalize, setAutocapitalize);
  accessor("editContext", editContext, setEditContext);
  accessor("contentEditable", contentEditable, setContentEditable);
  accessor("enterKeyHint", enterKeyHint, setEnterKeyHint);
  getter("isContentEditable", isContentEditable);
  accessor("inputMode", inputMode, setInputMode);
  accessor("virtualKeyboardPolicy", virtualKeyboardPolicy, setVirtualKeyboardPolicy);
  getter("offsetParent", offsetParent);
  getter("offsetTop", offsetTop);
  getter("offsetLeft", offsetLeft);
  getter("offsetWidth", offsetWidth);
  getter("offsetHeight", offsetHeight);
  accessor("popover", popover, setPopover);
  accessor("innerText", innerText, setInnerText);
  accessor("outerText", outerText, setOuterText);
  accessor("writingSuggestions", writingSuggestions, setWritingSuggestions);
  installHTMLElementEarlyEventMembers(accessor);
  getter("dataset", dataset);
  accessor("nonce", nonce, setNonce);
  accessor("autofocus", autofocus, setAutofocus);
  accessor("tabIndex", tabIndex, setTabIndex);
  getter("style", style);
  getter("attributeStyleMap", attributeStyleMap);
  method("attachInternals", attachInternals);
  method("blur", blur);
  method("click", click);
  method("focus", focus);
  method("hidePopover", hidePopover);
  method("showPopover", showPopover);
  method("togglePopover", togglePopover);
  installHTMLElementLateEventMembers(accessor);
  accessor("focusGroup", focusGroup, setFocusGroup);
  accessor("focusGroupStart", focusGroupStart, setFocusGroupStart);
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
