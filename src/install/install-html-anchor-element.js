import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
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
  hash,
  setHash,
} from "../api/dom/html-anchor-element-hash-property.js";
import {
  host,
  setHost,
} from "../api/dom/html-anchor-element-host-property.js";
import {
  hostname,
  setHostname,
} from "../api/dom/html-anchor-element-hostname-property.js";
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
  password,
  setPassword,
} from "../api/dom/html-anchor-element-password-property.js";
import {
  pathname,
  setPathname,
} from "../api/dom/html-anchor-element-pathname-property.js";
import {
  ping,
  setPing,
} from "../api/dom/html-anchor-element-ping-property.js";
import {
  port,
  setPort,
} from "../api/dom/html-anchor-element-port-property.js";
import {
  protocol,
  setProtocol,
} from "../api/dom/html-anchor-element-protocol-property.js";
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
  search,
  setSearch,
} from "../api/dom/html-anchor-element-search-property.js";
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
import {
  username,
  setUsername,
} from "../api/dom/html-anchor-element-username-property.js";

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
  accessor("protocol", protocol, setProtocol);
  accessor("username", username, setUsername);
  accessor("password", password, setPassword);
  accessor("host", host, setHost);
  accessor("hostname", hostname, setHostname);
  accessor("port", port, setPort);
  accessor("pathname", pathname, setPathname);
  accessor("search", search, setSearch);
  accessor("hash", hash, setHash);
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
