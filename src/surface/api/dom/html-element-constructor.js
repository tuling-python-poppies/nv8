import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { Element } from "./element-constructor.js";
import {
  HTML_NAMESPACE,
  initializeElement,
} from "./element-state.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

// 自定义元素 factory 原先是模块级 Map/单例，会跨 legacy Realm 共享。
const factorySlot = createRealmSlot(() => ({
  specializedFactories: new Map(),
  unknownElementFactory: null,
}), "html-element-constructor");

function factoryState() {
  return factorySlot.get(globalThis);
}

export function HTMLElement() {
  throw new TypeError("Illegal constructor");
}
registerNativeFunction(HTMLElement, "HTMLElement");

export function createHTMLElement(tagName, ownerDocument) {
  const state = factoryState();
  const specialized = state.specializedFactories.get(`${tagName}`.toLowerCase());
  if (specialized !== undefined) {
    return specialized(`${tagName}`.toLowerCase(), ownerDocument);
  }
  if (
    state.unknownElementFactory !== null
    && !`${tagName}`.includes("-")
    && !genericHTMLNames.has(`${tagName}`.toLowerCase())
  ) {
    return state.unknownElementFactory(`${tagName}`.toLowerCase(), ownerDocument);
  }
  const element = Object.create(HTMLElement.prototype);
  initializeElement(element, tagName, ownerDocument, HTML_NAMESPACE);
  return element;
}

export function registerHTMLElementFactory(tagName, factory) {
  factoryState().specializedFactories.set(`${tagName}`.toLowerCase(), factory);
}

export function registerHTMLUnknownElementFactory(factory) {
  factoryState().unknownElementFactory = factory;
}

const genericHTMLNames = new Set([
  "a", "abbr", "acronym", "address", "area", "article", "aside",
  "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote",
  "body", "br", "button", "canvas", "caption", "center", "cite", "code",
  "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn",
  "dialog", "dir", "div", "dl", "dt", "em", "embed", "fencedframe",
  "fieldset", "figcaption", "figure", "font", "footer", "form", "frame",
  "frameset", "geolocation", "h1", "h2", "h3", "h4", "h5", "h6",
  "head", "header", "hgroup", "hr", "html", "i", "iframe", "img", "input",
  "ins", "kbd", "label", "legend", "li", "link", "listing", "main", "map",
  "mark", "marquee", "menu", "meta", "meter", "nav", "nobr", "noembed",
  "noframes", "noscript", "object", "ol", "optgroup", "option", "output",
  "p", "param", "picture", "plaintext", "pre", "progress", "q", "rb", "rp",
  "rt", "rtc", "ruby", "s", "samp", "script", "search", "section",
  "select", "selectedcontent", "slot", "small", "source", "span", "strike",
  "strong", "style", "sub", "summary", "sup", "table", "tbody", "td",
  "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr",
  "track", "tt", "u", "ul", "var", "video", "wbr", "xmp",
]);

export function installHTMLElementConstructor() {
  Object.setPrototypeOf(HTMLElement.prototype, Element.prototype);
  Object.setPrototypeOf(HTMLElement, Element);
  delete HTMLElement.prototype.constructor;
  defineGlobalConstructor("HTMLElement", HTMLElement);
}

export function finishHTMLElementConstructor() {
  defineConstructorBacklink(HTMLElement.prototype, HTMLElement);
}

export function finishHTMLElementToStringTag() {
  defineToStringTag(HTMLElement.prototype, "HTMLElement");
}
