import {
  installElementAttributes,
} from "../api/dom/element-attributes-getter.js";
import {
  installElementAssignedSlot,
} from "../api/dom/element-assigned-slot-getter.js";
import {
  installElementAttachShadow,
} from "../api/dom/element-attach-shadow.js";
import { installElementAfter } from "../api/dom/element-after.js";
import { animate } from "../api/dom/element-animate.js";
import { installElementAppend } from "../api/dom/element-append.js";
import { installElementBefore } from "../api/dom/element-before.js";
import {
  installElementChildElementCount,
} from "../api/dom/element-child-element-count-getter.js";
import {
  installElementChildren,
} from "../api/dom/element-children-getter.js";
import {
  installElementClassName,
} from "../api/dom/element-class-name-property.js";
import {
  installElementClassList,
} from "../api/dom/element-class-list-getter.js";
import {
  finishElementConstructor,
  installElementConstructor,
} from "../api/dom/element-constructor.js";
import {
  installElementFirstElementChild,
} from "../api/dom/element-first-element-child-getter.js";
import {
  installElementGetAttribute,
} from "../api/dom/element-get-attribute.js";
import {
  installElementGetElementsByClassName,
} from "../api/dom/element-get-elements-by-class-name.js";
import {
  installElementGetElementsByTagName,
} from "../api/dom/element-get-elements-by-tag-name.js";
import {
  installElementGetAttributeNames,
} from "../api/dom/element-get-attribute-names.js";
import {
  installElementGetAttributeNode,
} from "../api/dom/element-get-attribute-node.js";
import {
  installElementGetAttributeNodeNS,
} from "../api/dom/element-get-attribute-node-ns.js";
import {
  installElementGetAttributeNS,
} from "../api/dom/element-get-attribute-ns.js";
import {
  installElementHasAttribute,
} from "../api/dom/element-has-attribute.js";
import {
  installElementHasAttributeNS,
} from "../api/dom/element-has-attribute-ns.js";
import {
  installElementHasAttributes,
} from "../api/dom/element-has-attributes.js";
import { installElementId } from "../api/dom/element-id-property.js";
import {
  installElementInnerHTML,
} from "../api/dom/element-inner-html-property.js";
import {
  installElementLastElementChild,
} from "../api/dom/element-last-element-child-getter.js";
import {
  installElementLocalName,
} from "../api/dom/element-local-name-getter.js";
import { installElementMatches } from "../api/dom/element-matches.js";
import {
  installElementNamespaceURI,
} from "../api/dom/element-namespace-uri-getter.js";
import {
  installElementOuterHTML,
} from "../api/dom/element-outer-html-property.js";
import { installElementPrepend } from "../api/dom/element-prepend.js";
import {
  installElementQuerySelector,
} from "../api/dom/element-query-selector.js";
import {
  installElementQuerySelectorAll,
} from "../api/dom/element-query-selector-all.js";
import {
  installElementPrefix,
} from "../api/dom/element-prefix-getter.js";
import {
  installElementRemoveAttribute,
} from "../api/dom/element-remove-attribute.js";
import { installElementRemove } from "../api/dom/element-remove.js";
import {
  installElementRemoveAttributeNode,
} from "../api/dom/element-remove-attribute-node.js";
import {
  installElementRemoveAttributeNS,
} from "../api/dom/element-remove-attribute-ns.js";
import {
  installElementSetAttribute,
} from "../api/dom/element-set-attribute.js";
import {
  installElementReplaceChildren,
} from "../api/dom/element-replace-children.js";
import {
  installElementReplaceWith,
} from "../api/dom/element-replace-with.js";
import {
  installElementSetAttributeNode,
} from "../api/dom/element-set-attribute-node.js";
import {
  installElementSetAttributeNodeNS,
} from "../api/dom/element-set-attribute-node-ns.js";
import {
  installElementSetAttributeNS,
} from "../api/dom/element-set-attribute-ns.js";
import {
  installElementShadowRoot,
} from "../api/dom/element-shadow-root-getter.js";
import {
  installElementTagName,
} from "../api/dom/element-tag-name-getter.js";
import { installElementClosest } from "../api/dom/element-closest.js";
import {
  installElementToggleAttribute,
} from "../api/dom/element-toggle-attribute.js";
import {
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
} from "../../engine/webidl/descriptor.js";
import { Element } from "../api/dom/element-constructor.js";
import { slot, setSlot } from "../api/dom/element-slot-property.js";
import { part } from "../api/dom/element-part-getter.js";
import { scrollTop, setScrollTop } from "../api/dom/element-scroll-top-property.js";
import { scrollLeft, setScrollLeft } from "../api/dom/element-scroll-left-property.js";
import { scrollWidth } from "../api/dom/element-scroll-width-getter.js";
import { scrollHeight } from "../api/dom/element-scroll-height-getter.js";
import { clientTop } from "../api/dom/element-client-top-getter.js";
import { clientLeft } from "../api/dom/element-client-left-getter.js";
import { clientWidth } from "../api/dom/element-client-width-getter.js";
import { clientHeight } from "../api/dom/element-client-height-getter.js";
import { onbeforecopy, setOnbeforecopy } from "../api/dom/element-onbeforecopy-property.js";
import { onbeforecut, setOnbeforecut } from "../api/dom/element-onbeforecut-property.js";
import { onbeforepaste, setOnbeforepaste } from "../api/dom/element-onbeforepaste-property.js";
import { onsearch, setOnsearch } from "../api/dom/element-onsearch-property.js";
import { elementTiming, setElementTiming } from "../api/dom/element-element-timing-property.js";
import { onfullscreenchange, setOnfullscreenchange } from "../api/dom/element-onfullscreenchange-property.js";
import { onfullscreenerror, setOnfullscreenerror } from "../api/dom/element-onfullscreenerror-property.js";
import { onwebkitfullscreenchange, setOnwebkitfullscreenchange } from "../api/dom/element-onwebkitfullscreenchange-property.js";
import { onwebkitfullscreenerror, setOnwebkitfullscreenerror } from "../api/dom/element-onwebkitfullscreenerror-property.js";
import * as aria from "../api/dom/element-aria-members.js";
import { previousElementSibling } from "../api/dom/element-previous-element-sibling-getter.js";
import { nextElementSibling } from "../api/dom/element-next-element-sibling-getter.js";
import { checkVisibility } from "../api/dom/element-check-visibility.js";
import { getAnimations } from "../api/dom/element-get-animations.js";
import { getBoundingClientRect } from "../api/dom/element-get-bounding-client-rect.js";
import { getClientRects } from "../api/dom/element-get-client-rects.js";
import { computedStyleMap } from "../api/dom/element-computed-style-map.js";
import { getElementsByTagNameNS } from "../api/dom/element-get-elements-by-tag-name-ns.js";
import { getHTML } from "../api/dom/element-get-html.js";
import { hasPointerCapture } from "../api/dom/element-has-pointer-capture.js";
import { insertAdjacentElement } from "../api/dom/element-insert-adjacent-element.js";
import { insertAdjacentHTML } from "../api/dom/element-insert-adjacent-html.js";
import { insertAdjacentText } from "../api/dom/element-insert-adjacent-text.js";
import { moveBefore } from "../api/dom/element-move-before.js";
import { releasePointerCapture } from "../api/dom/element-release-pointer-capture.js";
import { requestFullscreen } from "../api/dom/element-request-fullscreen.js";
import { requestPointerLock } from "../api/dom/element-request-pointer-lock.js";
import { scroll } from "../api/dom/element-scroll.js";
import { scrollBy } from "../api/dom/element-scroll-by.js";
import { scrollIntoView } from "../api/dom/element-scroll-into-view.js";
import { scrollIntoViewIfNeeded } from "../api/dom/element-scroll-into-view-if-needed.js";
import { scrollTo } from "../api/dom/element-scroll-to.js";
import { setHTMLUnsafe } from "../api/dom/element-set-html-unsafe.js";
import { setPointerCapture } from "../api/dom/element-set-pointer-capture.js";
import { webkitMatchesSelector } from "../api/dom/element-webkit-matches-selector.js";
import { webkitRequestFullScreen } from "../api/dom/element-webkit-request-full-screen.js";
import { webkitRequestFullscreen } from "../api/dom/element-webkit-request-fullscreen.js";
import { ariaNotify } from "../api/dom/element-aria-notify.js";
import { setHTML } from "../api/dom/element-set-html.js";
import { pseudo } from "../api/dom/element-pseudo.js";
import { currentCSSZoom } from "../api/dom/element-current-css-zoom-getter.js";
import { customElementRegistry } from "../api/dom/element-custom-element-registry-getter.js";
import { activeViewTransition } from "../api/dom/element-active-view-transition-getter.js";
import { startViewTransition } from "../api/dom/element-start-view-transition.js";

export function installElement() {
  installElementConstructor();
  installElementNamespaceURI();
  installElementPrefix();
  installElementLocalName();
  installElementTagName();
  installElementId();
  installElementClassName();
  installElementClassList();
  accessor("slot", slot, setSlot);
  installElementAttributes();
  installElementShadowRoot();
  getter("part", part);
  installElementAssignedSlot();
  installElementInnerHTML();
  installElementOuterHTML();
  accessor("scrollTop", scrollTop, setScrollTop);
  accessor("scrollLeft", scrollLeft, setScrollLeft);
  getter("scrollWidth", scrollWidth);
  getter("scrollHeight", scrollHeight);
  getter("clientTop", clientTop);
  getter("clientLeft", clientLeft);
  getter("clientWidth", clientWidth);
  getter("clientHeight", clientHeight);
  accessor("onbeforecopy", onbeforecopy, setOnbeforecopy);
  accessor("onbeforecut", onbeforecut, setOnbeforecut);
  accessor("onbeforepaste", onbeforepaste, setOnbeforepaste);
  accessor("onsearch", onsearch, setOnsearch);
  accessor("elementTiming", elementTiming, setElementTiming);
  accessor("onfullscreenchange", onfullscreenchange, setOnfullscreenchange);
  accessor("onfullscreenerror", onfullscreenerror, setOnfullscreenerror);
  accessor(
    "onwebkitfullscreenchange",
    onwebkitfullscreenchange,
    setOnwebkitfullscreenchange,
  );
  accessor(
    "onwebkitfullscreenerror",
    onwebkitfullscreenerror,
    setOnwebkitfullscreenerror,
  );
  accessor("role", aria.role, aria.setRole);
  accessor("ariaAtomic", aria.ariaAtomic, aria.setAriaAtomic);
  accessor("ariaAutoComplete", aria.ariaAutoComplete, aria.setAriaAutoComplete);
  accessor("ariaBusy", aria.ariaBusy, aria.setAriaBusy);
  accessor("ariaBrailleLabel", aria.ariaBrailleLabel, aria.setAriaBrailleLabel);
  accessor(
    "ariaBrailleRoleDescription",
    aria.ariaBrailleRoleDescription,
    aria.setAriaBrailleRoleDescription,
  );
  accessor("ariaChecked", aria.ariaChecked, aria.setAriaChecked);
  accessor("ariaColCount", aria.ariaColCount, aria.setAriaColCount);
  accessor("ariaColIndex", aria.ariaColIndex, aria.setAriaColIndex);
  accessor("ariaColSpan", aria.ariaColSpan, aria.setAriaColSpan);
  accessor("ariaCurrent", aria.ariaCurrent, aria.setAriaCurrent);
  accessor("ariaDescription", aria.ariaDescription, aria.setAriaDescription);
  accessor("ariaDisabled", aria.ariaDisabled, aria.setAriaDisabled);
  accessor("ariaExpanded", aria.ariaExpanded, aria.setAriaExpanded);
  accessor("ariaHasPopup", aria.ariaHasPopup, aria.setAriaHasPopup);
  accessor("ariaHidden", aria.ariaHidden, aria.setAriaHidden);
  accessor("ariaInvalid", aria.ariaInvalid, aria.setAriaInvalid);
  accessor(
    "ariaKeyShortcuts",
    aria.ariaKeyShortcuts,
    aria.setAriaKeyShortcuts,
  );
  accessor("ariaLabel", aria.ariaLabel, aria.setAriaLabel);
  accessor("ariaLevel", aria.ariaLevel, aria.setAriaLevel);
  accessor("ariaLive", aria.ariaLive, aria.setAriaLive);
  accessor("ariaModal", aria.ariaModal, aria.setAriaModal);
  accessor("ariaMultiLine", aria.ariaMultiLine, aria.setAriaMultiLine);
  accessor(
    "ariaMultiSelectable",
    aria.ariaMultiSelectable,
    aria.setAriaMultiSelectable,
  );
  accessor("ariaOrientation", aria.ariaOrientation, aria.setAriaOrientation);
  accessor("ariaPlaceholder", aria.ariaPlaceholder, aria.setAriaPlaceholder);
  accessor("ariaPosInSet", aria.ariaPosInSet, aria.setAriaPosInSet);
  accessor("ariaPressed", aria.ariaPressed, aria.setAriaPressed);
  accessor("ariaReadOnly", aria.ariaReadOnly, aria.setAriaReadOnly);
  accessor("ariaRelevant", aria.ariaRelevant, aria.setAriaRelevant);
  accessor("ariaRequired", aria.ariaRequired, aria.setAriaRequired);
  accessor(
    "ariaRoleDescription",
    aria.ariaRoleDescription,
    aria.setAriaRoleDescription,
  );
  accessor("ariaRowCount", aria.ariaRowCount, aria.setAriaRowCount);
  accessor("ariaRowIndex", aria.ariaRowIndex, aria.setAriaRowIndex);
  accessor("ariaRowSpan", aria.ariaRowSpan, aria.setAriaRowSpan);
  accessor("ariaSelected", aria.ariaSelected, aria.setAriaSelected);
  accessor("ariaSetSize", aria.ariaSetSize, aria.setAriaSetSize);
  accessor("ariaSort", aria.ariaSort, aria.setAriaSort);
  accessor("ariaValueMax", aria.ariaValueMax, aria.setAriaValueMax);
  accessor("ariaValueMin", aria.ariaValueMin, aria.setAriaValueMin);
  accessor("ariaValueNow", aria.ariaValueNow, aria.setAriaValueNow);
  accessor("ariaValueText", aria.ariaValueText, aria.setAriaValueText);
  installElementChildren();
  installElementFirstElementChild();
  installElementLastElementChild();
  installElementChildElementCount();
  getter("previousElementSibling", previousElementSibling);
  getter("nextElementSibling", nextElementSibling);
  installElementAfter();
  method("animate", animate);
  installElementAppend();
  installElementAttachShadow();
  installElementBefore();
  method("checkVisibility", checkVisibility);
  installElementClosest();
  method("computedStyleMap", computedStyleMap);
  method("getAnimations", getAnimations);
  installElementGetAttribute();
  installElementGetAttributeNS();
  installElementGetAttributeNames();
  installElementGetAttributeNode();
  installElementGetAttributeNodeNS();
  method("getBoundingClientRect", getBoundingClientRect);
  method("getClientRects", getClientRects);
  installElementGetElementsByClassName();
  installElementGetElementsByTagName();
  method("getElementsByTagNameNS", getElementsByTagNameNS);
  method("getHTML", getHTML);
  installElementHasAttribute();
  installElementHasAttributeNS();
  installElementHasAttributes();
  method("hasPointerCapture", hasPointerCapture);
  method("insertAdjacentElement", insertAdjacentElement);
  method("insertAdjacentHTML", insertAdjacentHTML);
  method("insertAdjacentText", insertAdjacentText);
  installElementMatches();
  method("moveBefore", moveBefore);
  installElementPrepend();
  installElementQuerySelector();
  installElementQuerySelectorAll();
  method("releasePointerCapture", releasePointerCapture);
  installElementRemove();
  installElementRemoveAttribute();
  installElementRemoveAttributeNS();
  installElementRemoveAttributeNode();
  installElementReplaceChildren();
  installElementReplaceWith();
  method("requestFullscreen", requestFullscreen);
  method("requestPointerLock", requestPointerLock);
  method("scroll", scroll);
  method("scrollBy", scrollBy);
  method("scrollIntoView", scrollIntoView);
  method("scrollIntoViewIfNeeded", scrollIntoViewIfNeeded);
  method("scrollTo", scrollTo);
  installElementSetAttribute();
  installElementSetAttributeNS();
  installElementSetAttributeNode();
  installElementSetAttributeNodeNS();
  method("setHTMLUnsafe", setHTMLUnsafe);
  method("setPointerCapture", setPointerCapture);
  installElementToggleAttribute();
  method("webkitMatchesSelector", webkitMatchesSelector);
  method("webkitRequestFullScreen", webkitRequestFullScreen);
  method("webkitRequestFullscreen", webkitRequestFullscreen);
  getter("currentCSSZoom", currentCSSZoom);
  getter("customElementRegistry", customElementRegistry);
  getter("activeViewTransition", activeViewTransition);
  accessor(
    "ariaColIndexText",
    aria.ariaColIndexText,
    aria.setAriaColIndexText,
  );
  accessor(
    "ariaRowIndexText",
    aria.ariaRowIndexText,
    aria.setAriaRowIndexText,
  );
  accessor(
    "ariaActiveDescendantElement",
    aria.ariaActiveDescendantElement,
    aria.setAriaActiveDescendantElement,
  );
  accessor(
    "ariaActionsElements",
    aria.ariaActionsElements,
    aria.setAriaActionsElements,
  );
  accessor(
    "ariaControlsElements",
    aria.ariaControlsElements,
    aria.setAriaControlsElements,
  );
  accessor(
    "ariaDescribedByElements",
    aria.ariaDescribedByElements,
    aria.setAriaDescribedByElements,
  );
  accessor(
    "ariaDetailsElements",
    aria.ariaDetailsElements,
    aria.setAriaDetailsElements,
  );
  accessor(
    "ariaErrorMessageElements",
    aria.ariaErrorMessageElements,
    aria.setAriaErrorMessageElements,
  );
  accessor(
    "ariaFlowToElements",
    aria.ariaFlowToElements,
    aria.setAriaFlowToElements,
  );
  accessor(
    "ariaLabelledByElements",
    aria.ariaLabelledByElements,
    aria.setAriaLabelledByElements,
  );
  method("ariaNotify", ariaNotify);
  method("pseudo", pseudo);
  method("setHTML", setHTML);
  method("startViewTransition", startViewTransition);
  finishElementConstructor();
}

function getter(name, callback) {
  definePrototypeGetter(Element.prototype, name, callback);
}

function accessor(name, getterCallback, setterCallback) {
  definePrototypeAccessor(
    Element.prototype,
    name,
    getterCallback,
    setterCallback,
  );
}

function method(name, callback) {
  definePrototypeMethod(Element.prototype, name, callback);
}
