import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { alt, setAlt } from "../api/dom/html-area-element-alt-property.js";
import { attributionSrc, setAttributionSrc } from "../api/dom/html-area-element-attribution-src-property.js";
import {
  HTMLAreaElement,
  installHTMLAreaElementConstructor,
} from "../api/dom/html-area-element-constructor.js";
import { coords, setCoords } from "../api/dom/html-area-element-coords-property.js";
import { download, setDownload } from "../api/dom/html-area-element-download-property.js";
import { href, setHref } from "../api/dom/html-area-element-href-property.js";
import { interestForElement, setInterestForElement } from "../api/dom/html-area-element-interest-for-element-property.js";
import { origin } from "../api/dom/html-area-element-origin-getter.js";
import { ping, setPing } from "../api/dom/html-area-element-ping-property.js";
import { referrerPolicy, setReferrerPolicy } from "../api/dom/html-area-element-referrer-policy-property.js";
import { relList, setRelList } from "../api/dom/html-area-element-rel-list-property.js";
import { rel, setRel } from "../api/dom/html-area-element-rel-property.js";
import { shape, setShape } from "../api/dom/html-area-element-shape-property.js";
import { target, setTarget } from "../api/dom/html-area-element-target-property.js";
import { toString } from "../api/dom/html-area-element-to-string.js";
import { areaURLComponentPropertyTable } from "../api/dom/area-urlcomponent-property-members.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-members.js";

export function installHTMLAreaElement() {
  installHTMLAreaElementConstructor();
  accessor("alt", alt, setAlt);
  accessor("coords", coords, setCoords);
  accessor("download", download, setDownload);
  accessor("shape", shape, setShape);
  accessor("target", target, setTarget);
  accessor("ping", ping, setPing);
  accessor("rel", rel, setRel);
  accessor("relList", relList, setRelList);
  accessor("referrerPolicy", referrerPolicy, setReferrerPolicy);for (const [name, entry] of booleanReflectionTable) accessor(name, entry.get, entry.set);
  definePrototypeGetter(HTMLAreaElement.prototype, "origin", origin);
  for (const [name, entry] of areaURLComponentPropertyTable) accessor(name, entry.get, entry.set);
  accessor("href", href, setHref);
  accessor("interestForElement", interestForElement, setInterestForElement);
  definePrototypeMethod(HTMLAreaElement.prototype, "toString", toString);
  defineConstructorBacklink(HTMLAreaElement.prototype, HTMLAreaElement);
  accessor("attributionSrc", attributionSrc, setAttributionSrc);
  defineToStringTag(HTMLAreaElement.prototype, "HTMLAreaElement");
}

function accessor(name, get, set) {
  definePrototypeAccessor(HTMLAreaElement.prototype, name, get, set);
}
