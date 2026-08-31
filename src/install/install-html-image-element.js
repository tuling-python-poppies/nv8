import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
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
import {
  browsingTopics,
  setBrowsingTopics,
} from "../api/dom/html-image-element-browsing-topics-property.js";
import { complete } from "../api/dom/html-image-element-complete-getter.js";
import {
  crossOrigin,
  setCrossOrigin,
} from "../api/dom/html-image-element-cross-origin-property.js";
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
import { height, setHeight } from "../api/dom/html-image-element-height-property.js";
import { hspace, setHspace } from "../api/dom/html-image-element-hspace-property.js";
import {
  HTMLImageElement,
  installHTMLImageElementConstructor,
} from "../api/dom/html-image-element-constructor.js";
import { isMap, setIsMap } from "../api/dom/html-image-element-is-map-property.js";
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
import {
  sharedStorageWritable,
  setSharedStorageWritable,
} from "../api/dom/html-image-element-shared-storage-writable-property.js";
import { sizes, setSizes } from "../api/dom/html-image-element-sizes-property.js";
import { src, setSrc } from "../api/dom/html-image-element-src-property.js";
import { srcset, setSrcset } from "../api/dom/html-image-element-srcset-property.js";
import { useMap, setUseMap } from "../api/dom/html-image-element-use-map-property.js";
import { vspace, setVspace } from "../api/dom/html-image-element-vspace-property.js";
import { width, setWidth } from "../api/dom/html-image-element-width-property.js";
import { x } from "../api/dom/html-image-element-x-getter.js";
import { y } from "../api/dom/html-image-element-y-getter.js";

export function installHTMLImageElement() {
  installHTMLImageElementConstructor();
  accessor("alt", alt, setAlt);
  accessor("src", src, setSrc);
  accessor("srcset", srcset, setSrcset);
  accessor("sizes", sizes, setSizes);
  accessor("crossOrigin", crossOrigin, setCrossOrigin);
  accessor("useMap", useMap, setUseMap);
  accessor("isMap", isMap, setIsMap);
  accessor("width", width, setWidth);
  accessor("height", height, setHeight);
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
  accessor("hspace", hspace, setHspace);
  accessor("vspace", vspace, setVspace);
  accessor("longDesc", longDesc, setLongDesc);
  accessor("border", border, setBorder);
  getter("x", x);
  getter("y", y);
  definePrototypeMethod(HTMLImageElement.prototype, "decode", decode);
  defineConstructorBacklink(HTMLImageElement.prototype, HTMLImageElement);
  accessor("browsingTopics", browsingTopics, setBrowsingTopics);
  accessor("attributionSrc", attributionSrc, setAttributionSrc);
  accessor(
    "sharedStorageWritable",
    sharedStorageWritable,
    setSharedStorageWritable,
  );
  defineToStringTag(HTMLImageElement.prototype, "HTMLImageElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLImageElement.prototype, name, getter, setter);
}

function getter(name, callback) {
  definePrototypeGetter(HTMLImageElement.prototype, name, callback);
}
