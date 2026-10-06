import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import { alt, setAlt } from "../api/dom/html-image-element-alt-property.js";
import { align, setAlign } from "../api/dom/html-image-element-align-property.js";
import {
  attributionSrc,
  setAttributionSrc,
} from "../api/dom/html-image-element-attribution-src-property.js";
import {
  border,
  setBorder,
} from "../api/dom/html-image-element-border-property.js";
import { complete } from "../api/dom/html-image-element-complete-getter.js";
import { currentSrc } from "../api/dom/html-image-element-current-src-getter.js";
import { decode } from "../api/dom/html-image-element-decode.js";
import {
  decoding,
  setDecoding,
} from "../api/dom/html-image-element-decoding-property.js";
import {
  fetchPriority,
  setFetchPriority,
} from "../api/dom/html-image-element-fetch-priority-property.js";
import {
  HTMLImageElement,
  installHTMLImageElementConstructor,
} from "../api/dom/html-image-element-constructor.js";
import { loading, setLoading } from "../api/dom/html-image-element-loading-property.js";
import { longDesc, setLongDesc } from "../api/dom/html-image-element-long-desc-property.js";
import { lowsrc, setLowsrc } from "../api/dom/html-image-element-lowsrc-property.js";
import { name, setName } from "../api/dom/html-image-element-name-property.js";
import { naturalHeight } from "../api/dom/html-image-element-natural-height-getter.js";
import { naturalWidth } from "../api/dom/html-image-element-natural-width-getter.js";
import {
  referrerPolicy,
  setReferrerPolicy,
} from "../api/dom/html-image-element-referrer-policy-property.js";
import { sizes, setSizes } from "../api/dom/html-image-element-sizes-property.js";
import { src, setSrc } from "../api/dom/html-image-element-src-property.js";
import { srcset, setSrcset } from "../api/dom/html-image-element-srcset-property.js";
import { useMap, setUseMap } from "../api/dom/html-image-element-use-map-property.js";
import { x } from "../api/dom/html-image-element-x-getter.js";
import { y } from "../api/dom/html-image-element-y-getter.js";
import { nullableStringReflectionTable } from "../api/dom/nullable-string-reflection-members.js";
import { unsignedReflectionTable } from "../api/dom/unsigned-reflection-members.js";
import { booleanReflectionTable } from "../api/dom/boolean-reflection-members.js";

export function installHTMLImageElement() {
  installHTMLImageElementConstructor();
  accessor("alt", alt, setAlt);
  accessor("src", src, setSrc);
  accessor("srcset", srcset, setSrcset);
  accessor("sizes", sizes, setSizes);
  for (const [name, entry] of nullableStringReflectionTable) accessor(name, entry.get, entry.set);
  accessor("useMap", useMap, setUseMap);for (const [name, entry] of booleanReflectionTable) accessor(name, entry.get, entry.set);
  for (const [name, entry] of unsignedReflectionTable) accessor(name, entry.get, entry.set);
  getter("naturalWidth", naturalWidth);
  getter("naturalHeight", naturalHeight);
  getter("complete", complete);
  getter("currentSrc", currentSrc);
  accessor("referrerPolicy", referrerPolicy, setReferrerPolicy);
  accessor("decoding", decoding, setDecoding);
  accessor("fetchPriority", fetchPriority, setFetchPriority);
  accessor("loading", loading, setLoading);
  accessor("name", name, setName);
  accessor("lowsrc", lowsrc, setLowsrc);
  accessor("align", align, setAlign);
  for (const [name, entry] of unsignedReflectionTable) accessor(name, entry.get, entry.set);
  accessor("longDesc", longDesc, setLongDesc);
  accessor("border", border, setBorder);
  getter("x", x);
  getter("y", y);
  definePrototypeMethod(HTMLImageElement.prototype, "decode", decode);
  defineConstructorBacklink(HTMLImageElement.prototype, HTMLImageElement);for (const [name, entry] of booleanReflectionTable) accessor(name, entry.get, entry.set);
  accessor("attributionSrc", attributionSrc, setAttributionSrc);for (const [name, entry] of booleanReflectionTable) accessor( name, entry.get, entry.set, );
  defineToStringTag(HTMLImageElement.prototype, "HTMLImageElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLImageElement.prototype, name, getter, setter);
}

function getter(name, callback) {
  definePrototypeGetter(HTMLImageElement.prototype, name, callback);
}
