import {
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
} from "../webidl/descriptor.js";
import {
  activeElement,
} from "../api/dom/shadow-root-active-element-getter.js";
import {
  adoptedStyleSheets,
  setAdoptedStyleSheets,
} from "../api/dom/shadow-root-adopted-style-sheets-property.js";
import {
  clonable,
} from "../api/dom/shadow-root-clonable-getter.js";
import {
  customElementRegistry,
} from "../api/dom/shadow-root-custom-element-registry-getter.js";
import {
  delegatesFocus,
} from "../api/dom/shadow-root-delegates-focus-getter.js";
import {
  elementFromPoint,
} from "../api/dom/shadow-root-element-from-point.js";
import {
  elementsFromPoint,
} from "../api/dom/shadow-root-elements-from-point.js";
import {
  fullscreenElement,
} from "../api/dom/shadow-root-fullscreen-element-getter.js";
import {
  getAnimations,
} from "../api/dom/shadow-root-get-animations.js";
import { getHTML } from "../api/dom/shadow-root-get-html.js";
import {
  getSelection,
} from "../api/dom/shadow-root-get-selection.js";
import { host } from "../api/dom/shadow-root-host-getter.js";
import {
  innerHTML,
  setInnerHTML,
} from "../api/dom/shadow-root-inner-html-property.js";
import { mode } from "../api/dom/shadow-root-mode-getter.js";
import {
  onslotchange,
  setOnslotchange,
} from "../api/dom/shadow-root-onslotchange-property.js";
import {
  pictureInPictureElement,
} from "../api/dom/shadow-root-picture-in-picture-element-getter.js";
import {
  pointerLockElement,
} from "../api/dom/shadow-root-pointer-lock-element-getter.js";
import {
  serializable,
} from "../api/dom/shadow-root-serializable-getter.js";
import {
  setHTML,
} from "../api/dom/shadow-root-set-html.js";
import {
  setHTMLUnsafe,
} from "../api/dom/shadow-root-set-html-unsafe.js";
import {
  ShadowRoot,
  finishShadowRootConstructor,
  installShadowRootConstructor,
} from "../api/dom/shadow-root-constructor.js";
import {
  slotAssignment,
} from "../api/dom/shadow-root-slot-assignment-getter.js";
import {
  styleSheets,
} from "../api/dom/shadow-root-style-sheets-getter.js";

export function installShadowRoot() {
  installShadowRootConstructor();
  definePrototypeGetter(ShadowRoot.prototype, "mode", mode);
  definePrototypeGetter(ShadowRoot.prototype, "host", host);
  definePrototypeAccessor(
    ShadowRoot.prototype,
    "onslotchange",
    onslotchange,
    setOnslotchange,
  );
  definePrototypeAccessor(
    ShadowRoot.prototype,
    "innerHTML",
    innerHTML,
    setInnerHTML,
  );
  definePrototypeGetter(
    ShadowRoot.prototype,
    "delegatesFocus",
    delegatesFocus,
  );
  definePrototypeGetter(
    ShadowRoot.prototype,
    "slotAssignment",
    slotAssignment,
  );
  definePrototypeGetter(ShadowRoot.prototype, "serializable", serializable);
  definePrototypeGetter(ShadowRoot.prototype, "clonable", clonable);
  definePrototypeGetter(ShadowRoot.prototype, "activeElement", activeElement);
  definePrototypeGetter(ShadowRoot.prototype, "styleSheets", styleSheets);
  definePrototypeGetter(
    ShadowRoot.prototype,
    "pointerLockElement",
    pointerLockElement,
  );
  definePrototypeGetter(
    ShadowRoot.prototype,
    "fullscreenElement",
    fullscreenElement,
  );
  definePrototypeAccessor(
    ShadowRoot.prototype,
    "adoptedStyleSheets",
    adoptedStyleSheets,
    setAdoptedStyleSheets,
  );
  definePrototypeGetter(
    ShadowRoot.prototype,
    "pictureInPictureElement",
    pictureInPictureElement,
  );
  definePrototypeMethod(
    ShadowRoot.prototype,
    "elementFromPoint",
    elementFromPoint,
  );
  definePrototypeMethod(
    ShadowRoot.prototype,
    "elementsFromPoint",
    elementsFromPoint,
  );
  definePrototypeMethod(ShadowRoot.prototype, "getAnimations", getAnimations);
  definePrototypeMethod(ShadowRoot.prototype, "getHTML", getHTML);
  definePrototypeMethod(ShadowRoot.prototype, "getSelection", getSelection);
  definePrototypeMethod(
    ShadowRoot.prototype,
    "setHTMLUnsafe",
    setHTMLUnsafe,
  );
  definePrototypeGetter(
    ShadowRoot.prototype,
    "customElementRegistry",
    customElementRegistry,
  );
  definePrototypeMethod(ShadowRoot.prototype, "setHTML", setHTML);
  finishShadowRootConstructor();
}
