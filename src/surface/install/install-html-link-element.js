import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { as, setAs } from "../api/dom/html-link-element-as-property.js";
import { blocking, setBlocking } from "../api/dom/html-link-element-blocking-property.js";
import { charset, setCharset } from "../api/dom/html-link-element-charset-property.js";
import {
  HTMLLinkElement,
  installHTMLLinkElementConstructor,
} from "../api/dom/html-link-element-constructor.js";
import { crossOrigin, setCrossOrigin } from "../api/dom/html-link-element-cross-origin-property.js";
import { disabled, setDisabled } from "../api/dom/html-link-element-disabled-property.js";
import { fetchPriority, setFetchPriority } from "../api/dom/html-link-element-fetch-priority-property.js";
import { href, setHref } from "../api/dom/html-link-element-href-property.js";
import { hreflang, setHreflang } from "../api/dom/html-link-element-hreflang-property.js";
import { imageSizes, setImageSizes } from "../api/dom/html-link-element-image-sizes-property.js";
import { imageSrcset, setImageSrcset } from "../api/dom/html-link-element-image-srcset-property.js";
import { integrity, setIntegrity } from "../api/dom/html-link-element-integrity-property.js";
import { media, setMedia } from "../api/dom/html-link-element-media-property.js";
import { referrerPolicy, setReferrerPolicy } from "../api/dom/html-link-element-referrer-policy-property.js";
import { relList, setRelList } from "../api/dom/html-link-element-rel-list-property.js";
import { rel, setRel } from "../api/dom/html-link-element-rel-property.js";
import { rev, setRev } from "../api/dom/html-link-element-rev-property.js";
import { sheet } from "../api/dom/html-link-element-sheet-getter.js";
import { sizes, setSizes } from "../api/dom/html-link-element-sizes-property.js";
import { target, setTarget } from "../api/dom/html-link-element-target-property.js";
import { type, setType } from "../api/dom/html-link-element-type-property.js";

export function installHTMLLinkElement() {
  installHTMLLinkElementConstructor();
  accessor("disabled", disabled, setDisabled);
  accessor("href", href, setHref);
  accessor("crossOrigin", crossOrigin, setCrossOrigin);
  accessor("rel", rel, setRel);
  accessor("relList", relList, setRelList);
  accessor("media", media, setMedia);
  accessor("hreflang", hreflang, setHreflang);
  accessor("type", type, setType);
  accessor("as", as, setAs);
  accessor("referrerPolicy", referrerPolicy, setReferrerPolicy);
  accessor("sizes", sizes, setSizes);
  accessor("fetchPriority", fetchPriority, setFetchPriority);
  accessor("imageSrcset", imageSrcset, setImageSrcset);
  accessor("imageSizes", imageSizes, setImageSizes);
  accessor("charset", charset, setCharset);
  accessor("rev", rev, setRev);
  accessor("target", target, setTarget);
  definePrototypeGetter(HTMLLinkElement.prototype, "sheet", sheet);
  accessor("integrity", integrity, setIntegrity);
  accessor("blocking", blocking, setBlocking);
  defineConstructorBacklink(HTMLLinkElement.prototype, HTMLLinkElement);
  defineToStringTag(HTMLLinkElement.prototype, "HTMLLinkElement");
}

function accessor(name, get, set) {
  definePrototypeAccessor(HTMLLinkElement.prototype, name, get, set);
}
