import { defaultDocumentTimeline } from "../animation/animation-timeline-state.js";
import {
  createFragmentDirective,
} from "../navigation-diagnostics/navigation-diagnostics-runtime.js";
import {
  createFeaturePolicy,
} from "../feature-policy/feature-policy-runtime.js";
import {
  createFontFaceSet,
} from "../local-fonts/font-face-set-runtime.js";
import { createStyleSheetList } from "../css/style-sheet-list-state.js";
import {
  documentBody,
  documentCollection,
  documentElementOf,
  documentElements,
  requireDocument,
} from "./document-record.js";
import { requireNode } from "./node-state.js";

export function characterSetAlias(document) { return requireDocument(document).characterSet; }
export function xmlEncodingValue(document) { requireDocument(document); return null; }
export function xmlVersionValue(document) { return requireDocument(document).xmlVersion ?? "1.0"; }
export function setXmlVersion(document, value) { requireDocument(document).xmlVersion = `${value}`; }
export function xmlStandaloneValue(document) { return requireDocument(document).xmlStandalone ?? false; }
export function setXmlStandalone(document, value) { requireDocument(document).xmlStandalone = Boolean(value); }
export function domainValue(document) { return new URL(requireDocument(document).URL).hostname; }
export function setDomain(document, value) {
  const normalized = `${value}`.toLowerCase();
  const hostname = new URL(requireDocument(document).URL).hostname;
  if (normalized !== hostname && !hostname.endsWith(`.${normalized}`)) {
    throw new DOMException("The domain is not a suffix of this document's host.", "SecurityError");
  }
}
export function referrerValue(document) { return requireDocument(document).referrer; }
export function lastModifiedValue(document) { requireDocument(document); return "01/01/1970 00:00:00"; }
export function dirValue(document) { return documentBody(document)?.dir ?? ""; }
export function setDir(document, value) { const body = documentBody(document); if (body !== null) body.dir = value; }
export function designModeValue(document) { return requireDocument(document).designMode; }
export function setDesignMode(document, value) {
  requireDocument(document).designMode = `${value}`.toLowerCase() === "on" ? "on" : "off";
}
export function colorValue(name) { return document => requireDocument(document)[name] ?? ""; }
export function setColor(name) { return (document, value) => { requireDocument(document)[name] = `${value}`; }; }
export function documentElementsCollection(key, predicate) {
  return document => documentCollection(document, key, () => documentElements(document).filter(predicate));
}
export const imagesValue = documentElementsCollection("images", element => element.localName === "img");
export const embedsValue = documentElementsCollection("embeds", element => element.localName === "embed");
export const linksValue = documentElementsCollection("links", element =>
  (element.localName === "a" || element.localName === "area") && element.hasAttribute("href"));
export const formsValue = documentElementsCollection("forms", element => element.localName === "form");
export const scriptsValue = documentElementsCollection("scripts", element => element.localName === "script");
export const anchorsValue = documentElementsCollection("anchors", element =>
  element.localName === "a" && element.hasAttribute("name"));
export const appletsValue = documentElementsCollection("applets", () => false);
export const fgColorValue = colorValue("fgColor");
export const setFgColor = setColor("fgColor");
export const linkColorValue = colorValue("linkColor");
export const setLinkColor = setColor("linkColor");
export const vlinkColorValue = colorValue("vlinkColor");
export const setVlinkColor = setColor("vlinkColor");
export const alinkColorValue = colorValue("alinkColor");
export const setAlinkColor = setColor("alinkColor");
export const bgColorValue = colorValue("bgColor");
export const setBgColor = setColor("bgColor");
export function scrollingElementValue(document) { return documentBody(document) ?? documentElementOf(document); }
export function falseValue(document) { requireDocument(document); return false; }
export function trueValue(document) { requireDocument(document); return true; }
export function visibleValue(document) { requireDocument(document); return "visible"; }
export function featurePolicyValue(document) {
  const state = requireDocument(document);
  if (state.featurePolicy === undefined) {
    state.featurePolicy = createFeaturePolicy();
  }
  return state.featurePolicy;
}
export function timelineValue(document) { requireDocument(document); return defaultDocumentTimeline(); }
export function fullscreenValue(document) { return requireDocument(document).fullscreenElement !== null; }
export function fullscreenElementValue(document) { return requireDocument(document).fullscreenElement; }
export function rootElementValue(document) { return documentElementOf(document); }
export function documentChildren(document) {
  requireDocument(document);
  return documentCollection(document, "children", () =>
    requireNode(document).children.filter(child => requireNode(child).nodeType === 1));
}
export function firstElementChildValue(document) { return documentChildren(document)[0] ?? null; }
export function lastElementChildValue(document) {
  const children = documentChildren(document);
  return children.length === 0 ? null : children[children.length - 1];
}
export function childElementCountValue(document) { return documentChildren(document).length; }
export function activeElementValue(document) { return requireDocument(document).activeElement ?? documentBody(document); }
export function emptyArrayValue(name) {
  return document => {
    const state = requireDocument(document);
    if (state[name] === undefined) state[name] = [];
    return state[name];
  };
}
export function styleSheetsValue(document) {
  const state = requireDocument(document);
  if (state.styleSheets === undefined) {
    state.styleSheets = createStyleSheetList(() =>
      documentElements(document)
        .filter(element => element.localName === "style"
          || (element.localName === "link"
            && element.relList?.contains("stylesheet")))
        .map(element => element.sheet)
        .filter(sheet => sheet !== null));
  }
  return state.styleSheets;
}
export function pointerLockElementValue(document) { return requireDocument(document).pointerLockElement; }
export function adoptedStyleSheetsValue(document) { return requireDocument(document).adoptedStyleSheets; }
export function setAdoptedStyleSheets(document, value) {
  if (value === null || value === undefined || typeof value[Symbol.iterator] !== "function") {
    throw new TypeError("adoptedStyleSheets must be iterable");
  }
  requireDocument(document).adoptedStyleSheets = [...value];
}
export function nullValue(document) { requireDocument(document); return null; }
export function fontsValue(document) {
  const state = requireDocument(document);
  if (state.fonts === undefined) state.fonts = createFontFaceSet();
  return state.fonts;
}
export function fragmentDirectiveValue(document) {
  const state = requireDocument(document);
  if (state.fragmentDirective === undefined) {
    state.fragmentDirective = createFragmentDirective();
  }
  return state.fragmentDirective;
}
export function activeViewTransitionValue(document) { return requireDocument(document).activeViewTransition; }
export function customElementRegistryValue(document) { requireDocument(document); return globalThis.customElements; }
