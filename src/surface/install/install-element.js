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
  Element,
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
import { part } from "../api/dom/element-part-getter.js";
import { scrollWidth } from "../api/dom/element-scroll-width-getter.js";
import { scrollHeight } from "../api/dom/element-scroll-height-getter.js";
import { clientTop } from "../api/dom/element-client-top-getter.js";
import { clientLeft } from "../api/dom/element-client-left-getter.js";
import { clientWidth } from "../api/dom/element-client-width-getter.js";
import { clientHeight } from "../api/dom/element-client-height-getter.js";
import * as aria from "../api/dom/element-aria-members.js";
import { previousElementSibling } from "../api/dom/element-previous-element-sibling-getter.js";
import { nextElementSibling } from "../api/dom/element-next-element-sibling-getter.js";
import { getBoundingClientRect } from "../api/dom/element-get-bounding-client-rect.js";
import { getClientRects } from "../api/dom/element-get-client-rects.js";
import { computedStyleMap } from "../api/dom/element-computed-style-map.js";
import { requestFullscreen } from "../api/dom/element-request-fullscreen.js";
import { requestPointerLock } from "../api/dom/element-request-pointer-lock.js";
import { webkitRequestFullScreen } from "../api/dom/element-webkit-request-full-screen.js";
import { webkitRequestFullscreen } from "../api/dom/element-webkit-request-fullscreen.js";
import { pseudo } from "../api/dom/element-pseudo.js";
import { currentCSSZoom } from "../api/dom/element-current-css-zoom-getter.js";
import { customElementRegistry } from "../api/dom/element-custom-element-registry-getter.js";
import { activeViewTransition } from "../api/dom/element-active-view-transition-getter.js";
import { startViewTransition } from "../api/dom/element-start-view-transition.js";
import { elementStringPropertyTable } from "../api/dom/element-string-property-members.js";
import { elementExtendedMethodTable } from "../api/dom/element-extended-method-members.js";
import { elementNumberPropertyTable } from "../api/dom/element-number-property-members.js";
import { elementHandlerPropertyTable } from "../api/dom/element-handler-property-members.js";

export function installElement() {
  installElementConstructor();
  installElementNamespaceURI();
  installElementPrefix();
  installElementLocalName();
  installElementTagName();
  installElementId();
  installElementClassName();
  installElementClassList();
  for (const [name, entry] of elementStringPropertyTable) accessor(name, entry.get, entry.set);
  installElementAttributes();
  installElementShadowRoot();
  getter("part", part);
  installElementAssignedSlot();
  installElementInnerHTML();
  installElementOuterHTML();
  for (const [name, entry] of elementNumberPropertyTable) accessor(name, entry.get, entry.set);
  getter("scrollWidth", scrollWidth);
  getter("scrollHeight", scrollHeight);
  getter("clientTop", clientTop);
  getter("clientLeft", clientLeft);
  getter("clientWidth", clientWidth);
  getter("clientHeight", clientHeight);for (const [name, entry] of elementHandlerPropertyTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of elementStringPropertyTable) accessor(name, entry.get, entry.set);for (const [name, entry] of elementHandlerPropertyTable) accessor(name, entry.get, entry.set);for (const [name, entry] of elementHandlerPropertyTable) accessor( name, entry.get, entry.set, );for (const [name, entry] of aria.elementNullableStringPropertyTable) accessor(name, entry.get, entry.set);for (const [name, entry] of aria.elementNullableStringPropertyTable) accessor( name, entry.get, entry.set, );for (const [name, entry] of aria.elementNullableStringPropertyTable) accessor(name, entry.get, entry.set);for (const [name, entry] of aria.elementNullableStringPropertyTable) accessor( name, entry.get, entry.set, );for (const [name, entry] of aria.elementNullableStringPropertyTable) accessor(name, entry.get, entry.set);for (const [name, entry] of aria.elementNullableStringPropertyTable) accessor( name, entry.get, entry.set, );for (const [name, entry] of aria.elementNullableStringPropertyTable) accessor(name, entry.get, entry.set);for (const [name, entry] of aria.elementNullableStringPropertyTable) accessor( name, entry.get, entry.set, );for (const [name, entry] of aria.elementNullableStringPropertyTable) accessor(name, entry.get, entry.set);
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
  for (const [name, entry] of elementExtendedMethodTable) method(name, entry);
  installElementClosest();
  method("computedStyleMap", computedStyleMap);
  for (const [name, entry] of elementExtendedMethodTable) method(name, entry);
  installElementGetAttribute();
  installElementGetAttributeNS();
  installElementGetAttributeNames();
  installElementGetAttributeNode();
  installElementGetAttributeNodeNS();
  method("getBoundingClientRect", getBoundingClientRect);
  method("getClientRects", getClientRects);
  installElementGetElementsByClassName();
  installElementGetElementsByTagName();
  for (const [name, entry] of elementExtendedMethodTable) method(name, entry);
  installElementHasAttribute();
  installElementHasAttributeNS();
  installElementHasAttributes();
  for (const [name, entry] of elementExtendedMethodTable) method(name, entry);
  installElementMatches();
  for (const [name, entry] of elementExtendedMethodTable) method(name, entry);
  installElementPrepend();
  installElementQuerySelector();
  installElementQuerySelectorAll();
  for (const [name, entry] of elementExtendedMethodTable) method(name, entry);
  installElementRemove();
  installElementRemoveAttribute();
  installElementRemoveAttributeNS();
  installElementRemoveAttributeNode();
  installElementReplaceChildren();
  installElementReplaceWith();
  method("requestFullscreen", requestFullscreen);
  method("requestPointerLock", requestPointerLock);
  for (const [name, entry] of elementExtendedMethodTable) method(name, entry);
  installElementSetAttribute();
  installElementSetAttributeNS();
  installElementSetAttributeNode();
  installElementSetAttributeNodeNS();
  for (const [name, entry] of elementExtendedMethodTable) method(name, entry);
  installElementToggleAttribute();
  for (const [name, entry] of elementExtendedMethodTable) method(name, entry);
  method("webkitRequestFullScreen", webkitRequestFullScreen);
  method("webkitRequestFullscreen", webkitRequestFullscreen);
  getter("currentCSSZoom", currentCSSZoom);
  getter("customElementRegistry", customElementRegistry);
  getter("activeViewTransition", activeViewTransition);for (const [name, entry] of aria.elementNullableStringPropertyTable) accessor( name, entry.get, entry.set, );for (const [name, entry] of aria.ariaElementPropertyTable) accessor( name, entry.get, entry.set, );
  for (const [name, entry] of elementExtendedMethodTable) method(name, entry);
  method("pseudo", pseudo);
  for (const [name, entry] of elementExtendedMethodTable) method(name, entry);
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
