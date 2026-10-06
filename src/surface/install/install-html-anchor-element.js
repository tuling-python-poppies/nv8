import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  HTMLAnchorElement,
  installHTMLAnchorElementConstructor,
} from "../api/dom/html-anchor-element-constructor.js";
import {
  attributionSrc,
  setAttributionSrc,
} from "../api/dom/html-anchor-element-attribution-src-property.js";
import {
  charset,
  setCharset,
} from "../api/dom/html-anchor-element-charset-property.js";
import {
  coords,
  setCoords,
} from "../api/dom/html-anchor-element-coords-property.js";
import {
  download,
  setDownload,
} from "../api/dom/html-anchor-element-download-property.js";
import {
  href,
  setHref,
} from "../api/dom/html-anchor-element-href-property.js";
import {
  hreflang,
  setHreflang,
} from "../api/dom/html-anchor-element-hreflang-property.js";
import {
  hrefTranslate,
  setHrefTranslate,
} from "../api/dom/html-anchor-element-href-translate-property.js";
import {
  interestForElement,
  setInterestForElement,
} from "../api/dom/html-anchor-element-interest-for-element-property.js";
import {
  name,
  setName,
} from "../api/dom/html-anchor-element-name-property.js";
import { origin } from "../api/dom/html-anchor-element-origin-getter.js";
import {
  ping,
  setPing,
} from "../api/dom/html-anchor-element-ping-property.js";
import {
  referrerPolicy,
  setReferrerPolicy,
} from "../api/dom/html-anchor-element-referrer-policy-property.js";
import {
  rel,
  setRel,
} from "../api/dom/html-anchor-element-rel-property.js";
import {
  relList,
} from "../api/dom/html-anchor-element-rel-list-getter.js";
import {
  rev,
  setRev,
} from "../api/dom/html-anchor-element-rev-property.js";
import {
  shape,
  setShape,
} from "../api/dom/html-anchor-element-shape-property.js";
import {
  target,
  setTarget,
} from "../api/dom/html-anchor-element-target-property.js";
import {
  text,
  setText,
} from "../api/dom/html-anchor-element-text-property.js";
import { toString } from "../api/dom/html-anchor-element-to-string.js";
import {
  type,
  setType,
} from "../api/dom/html-anchor-element-type-property.js";
import { anchorURLComponentPropertyTable } from "../api/dom/anchor-urlcomponent-property-members.js";

export function installHTMLAnchorElement() {
  installHTMLAnchorElementConstructor();
  accessor("target", target, setTarget);
  accessor("download", download, setDownload);
  accessor("ping", ping, setPing);
  accessor("rel", rel, setRel);
  definePrototypeGetter(HTMLAnchorElement.prototype, "relList", relList);
  accessor("hreflang", hreflang, setHreflang);
  accessor("type", type, setType);
  accessor("referrerPolicy", referrerPolicy, setReferrerPolicy);
  accessor("text", text, setText);
  accessor("coords", coords, setCoords);
  accessor("charset", charset, setCharset);
  accessor("name", name, setName);
  accessor("rev", rev, setRev);
  accessor("shape", shape, setShape);
  definePrototypeGetter(HTMLAnchorElement.prototype, "origin", origin);
  for (const [name, entry] of anchorURLComponentPropertyTable) accessor(name, entry.get, entry.set);
  accessor("href", href, setHref);
  accessor(
    "interestForElement",
    interestForElement,
    setInterestForElement,
  );
  definePrototypeMethod(HTMLAnchorElement.prototype, "toString", toString);
  defineConstructorBacklink(
    HTMLAnchorElement.prototype,
    HTMLAnchorElement,
  );
  accessor("hrefTranslate", hrefTranslate, setHrefTranslate);
  accessor("attributionSrc", attributionSrc, setAttributionSrc);
  defineToStringTag(HTMLAnchorElement.prototype, "HTMLAnchorElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(
    HTMLAnchorElement.prototype,
    name,
    getter,
    setter,
  );
}
