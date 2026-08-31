import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  asyncValue,
  setAsync,
} from "../api/dom/html-script-element-async-property.js";
import {
  attributionSrc,
  setAttributionSrc,
} from "../api/dom/html-script-element-attribution-src-property.js";
import {
  blocking,
} from "../api/dom/html-script-element-blocking-getter.js";
import {
  charset,
  setCharset,
} from "../api/dom/html-script-element-charset-property.js";
import {
  HTMLScriptElement,
  installHTMLScriptElementConstructor,
} from "../api/dom/html-script-element-constructor.js";
import {
  crossOrigin,
  setCrossOrigin,
} from "../api/dom/html-script-element-cross-origin-property.js";
import {
  defer,
  setDefer,
} from "../api/dom/html-script-element-defer-property.js";
import {
  event,
  setEvent,
} from "../api/dom/html-script-element-event-property.js";
import {
  fetchPriority,
  setFetchPriority,
} from "../api/dom/html-script-element-fetch-priority-property.js";
import {
  htmlFor,
  setHtmlFor,
} from "../api/dom/html-script-element-html-for-property.js";
import {
  innerText,
  setInnerText,
} from "../api/dom/html-script-element-inner-text-property.js";
import {
  integrity,
  setIntegrity,
} from "../api/dom/html-script-element-integrity-property.js";
import {
  noModule,
  setNoModule,
} from "../api/dom/html-script-element-no-module-property.js";
import {
  referrerPolicy,
  setReferrerPolicy,
} from "../api/dom/html-script-element-referrer-policy-property.js";
import {
  src,
  setSrc,
} from "../api/dom/html-script-element-src-property.js";
import {
  textContent,
  setTextContent,
} from "../api/dom/html-script-element-text-content-property.js";
import {
  text,
  setText,
} from "../api/dom/html-script-element-text-property.js";
import {
  type,
  setType,
} from "../api/dom/html-script-element-type-property.js";

export function installHTMLScriptElement() {
  installHTMLScriptElementConstructor();
  accessor("src", src, setSrc);
  accessor("type", type, setType);
  accessor("noModule", noModule, setNoModule);
  accessor("charset", charset, setCharset);
  accessor("async", asyncValue, setAsync);
  accessor("defer", defer, setDefer);
  accessor("crossOrigin", crossOrigin, setCrossOrigin);
  accessor("text", text, setText);
  accessor("referrerPolicy", referrerPolicy, setReferrerPolicy);
  accessor("fetchPriority", fetchPriority, setFetchPriority);
  accessor("event", event, setEvent);
  accessor("htmlFor", htmlFor, setHtmlFor);
  accessor("integrity", integrity, setIntegrity);
  definePrototypeGetter(HTMLScriptElement.prototype, "blocking", blocking);
  accessor("textContent", textContent, setTextContent);
  accessor("innerText", innerText, setInnerText);
  defineConstructorBacklink(HTMLScriptElement.prototype, HTMLScriptElement);
  accessor("attributionSrc", attributionSrc, setAttributionSrc);
  defineToStringTag(HTMLScriptElement.prototype, "HTMLScriptElement");
}

function accessor(name, getter, setter) {
  definePrototypeAccessor(HTMLScriptElement.prototype, name, getter, setter);
}
