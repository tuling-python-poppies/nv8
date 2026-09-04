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
import { hash, setHash } from "../api/dom/html-area-element-hash-property.js";
import { host, setHost } from "../api/dom/html-area-element-host-property.js";
import { hostname, setHostname } from "../api/dom/html-area-element-hostname-property.js";
import { href, setHref } from "../api/dom/html-area-element-href-property.js";
import { interestForElement, setInterestForElement } from "../api/dom/html-area-element-interest-for-element-property.js";
import { noHref, setNoHref } from "../api/dom/html-area-element-no-href-property.js";
import { origin } from "../api/dom/html-area-element-origin-getter.js";
import { password, setPassword } from "../api/dom/html-area-element-password-property.js";
import { pathname, setPathname } from "../api/dom/html-area-element-pathname-property.js";
import { ping, setPing } from "../api/dom/html-area-element-ping-property.js";
import { port, setPort } from "../api/dom/html-area-element-port-property.js";
import { protocol, setProtocol } from "../api/dom/html-area-element-protocol-property.js";
import { referrerPolicy, setReferrerPolicy } from "../api/dom/html-area-element-referrer-policy-property.js";
import { relList, setRelList } from "../api/dom/html-area-element-rel-list-property.js";
import { rel, setRel } from "../api/dom/html-area-element-rel-property.js";
import { search, setSearch } from "../api/dom/html-area-element-search-property.js";
import { shape, setShape } from "../api/dom/html-area-element-shape-property.js";
import { target, setTarget } from "../api/dom/html-area-element-target-property.js";
import { toString } from "../api/dom/html-area-element-to-string.js";
import { username, setUsername } from "../api/dom/html-area-element-username-property.js";

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
  accessor("referrerPolicy", referrerPolicy, setReferrerPolicy);
  accessor("noHref", noHref, setNoHref);
  definePrototypeGetter(HTMLAreaElement.prototype, "origin", origin);
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
  accessor("interestForElement", interestForElement, setInterestForElement);
  definePrototypeMethod(HTMLAreaElement.prototype, "toString", toString);
  defineConstructorBacklink(HTMLAreaElement.prototype, HTMLAreaElement);
  accessor("attributionSrc", attributionSrc, setAttributionSrc);
  defineToStringTag(HTMLAreaElement.prototype, "HTMLAreaElement");
}

function accessor(name, get, set) {
  definePrototypeAccessor(HTMLAreaElement.prototype, name, get, set);
}
