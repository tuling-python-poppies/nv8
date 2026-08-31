import {
  installDocumentBody,
} from "../api/dom/document-body-getter.js";
import { installDocumentAll } from "../api/dom/document-all-getter.js";
import {
  installDocumentAdoptNode,
} from "../api/dom/document-adopt-node.js";
import {
  installDocumentCharacterSet,
} from "../api/dom/document-character-set-getter.js";
import {
  installDocumentCompatMode,
} from "../api/dom/document-compat-mode-getter.js";
import {
  finishDocumentConstructor,
  finishDocumentToStringTag,
  finishDocumentUnscopables,
  Document,
  installDocumentConstructor,
} from "../api/dom/document-constructor.js";
import {
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
} from "../webidl/descriptor.js";
import * as extended from "../api/dom/document-extended-property-members.js";
import * as methods from "../api/dom/document-extended-method-members.js";
import {
  installDocumentFullscreenEventMembers,
  installDocumentLateEventMembers,
  installDocumentLifecycleEventMembers,
  installDocumentMainEventMembers,
  installDocumentPointerLockEventMembers,
  installDocumentPostConstructorEventMembers,
  installDocumentReadinessEventMembers,
  installDocumentWebkitFullscreenEventMembers,
} from "../api/dom/document-event-members.js";
import {
  installDocumentContentType,
} from "../api/dom/document-content-type-getter.js";
import {
  installDocumentCreateAttribute,
} from "../api/dom/document-create-attribute.js";
import {
  installDocumentCreateAttributeNS,
} from "../api/dom/document-create-attribute-ns.js";
import {
  installDocumentCreateCDATASection,
} from "../api/dom/document-create-cdata-section.js";
import {
  installDocumentCreateComment,
} from "../api/dom/document-create-comment.js";
import {
  installDocumentCreateDocumentFragment,
} from "../api/dom/document-create-document-fragment.js";
import {
  installDocumentCreateElement,
} from "../api/dom/document-create-element.js";
import {
  installDocumentCreateElementNS,
} from "../api/dom/document-create-element-ns.js";
import {
  installDocumentCreateEvent,
} from "../api/dom/document-create-event.js";
import {
  installDocumentCreateNodeIterator,
} from "../api/dom/document-create-node-iterator.js";
import {
  installDocumentCreateProcessingInstruction,
} from "../api/dom/document-create-processing-instruction.js";
import {
  installDocumentCreateTextNode,
} from "../api/dom/document-create-text-node.js";
import {
  installDocumentCreateTreeWalker,
} from "../api/dom/document-create-tree-walker.js";
import {
  installDocumentCreateRange,
} from "../api/dom/document-create-range.js";
import {
  installDocumentCurrentScript,
} from "../api/dom/document-current-script-getter.js";
import {
  installDocumentCookie,
} from "../api/dom/document-cookie-property.js";
import {
  installDocumentDefaultView,
} from "../api/dom/document-default-view-getter.js";
import {
  installDocumentDocumentElement,
} from "../api/dom/document-document-element-getter.js";
import {
  installDocumentDoctype,
} from "../api/dom/document-doctype-getter.js";
import {
  globalDocument,
} from "../api/dom/document-global-getter.js";
import {
  installDocumentGetElementById,
} from "../api/dom/document-get-element-by-id.js";
import {
  installDocumentGetElementsByClassName,
} from "../api/dom/document-get-elements-by-class-name.js";
import {
  installDocumentGetElementsByTagName,
} from "../api/dom/document-get-elements-by-tag-name.js";
import {
  installDocumentGetSelection,
} from "../api/dom/document-get-selection.js";
import {
  installDocumentHead,
} from "../api/dom/document-head-getter.js";
import {
  installDocumentImplementation,
} from "../api/dom/document-implementation-getter.js";
import {
  installDocumentImportNode,
} from "../api/dom/document-import-node.js";
import {
  installDocumentReadyState,
} from "../api/dom/document-ready-state-getter.js";
import {
  installDocumentQuerySelector,
} from "../api/dom/document-query-selector.js";
import {
  installDocumentQuerySelectorAll,
} from "../api/dom/document-query-selector-all.js";
import { createDocument } from "../api/dom/document-record.js";
import {
  installDocumentURI,
} from "../api/dom/document-uri-getter.js";
import {
  installDocumentTitle,
} from "../api/dom/document-title-property.js";
import {
  installDocumentURL,
} from "../api/dom/document-url-getter.js";

export function installDocument() {
  installDocumentConstructor();
  installDocumentImplementation();
  installDocumentURL();
  installDocumentURI();
  installDocumentCompatMode();
  installDocumentCharacterSet();
  getter("charset", extended.charset);
  getter("inputEncoding", extended.inputEncoding);
  installDocumentContentType();
  installDocumentDoctype();
  installDocumentDocumentElement();
  getter("xmlEncoding", extended.xmlEncoding);
  accessor("xmlVersion", extended.xmlVersion, extended.setXmlVersion);
  accessor("xmlStandalone", extended.xmlStandalone, extended.setXmlStandalone);
  accessor("domain", extended.domain, extended.setDomain);
  getter("referrer", extended.referrer);
  installDocumentCookie();
  getter("lastModified", extended.lastModified);
  installDocumentReadyState();
  installDocumentTitle();
  accessor("dir", extended.dir, extended.setDir);
  installDocumentBody();
  installDocumentHead();
  getter("images", extended.images);
  getter("embeds", extended.embeds);
  getter("plugins", extended.plugins);
  getter("links", extended.links);
  getter("forms", extended.forms);
  getter("scripts", extended.scripts);
  installDocumentCurrentScript();
  installDocumentDefaultView();
  accessor("designMode", extended.designMode, extended.setDesignMode);
  installDocumentReadinessEventMembers(accessor);
  getter("anchors", extended.anchors);
  getter("applets", extended.applets);
  accessor("fgColor", extended.fgColor, extended.setFgColor);
  accessor("linkColor", extended.linkColor, extended.setLinkColor);
  accessor("vlinkColor", extended.vlinkColor, extended.setVlinkColor);
  accessor("alinkColor", extended.alinkColor, extended.setAlinkColor);
  accessor("bgColor", extended.bgColor, extended.setBgColor);
  installDocumentAll();
  getter("scrollingElement", extended.scrollingElement);
  installDocumentPointerLockEventMembers(accessor);
  getter("hidden", extended.hidden);
  getter("visibilityState", extended.visibilityState);
  getter("wasDiscarded", extended.wasDiscarded);
  getter("prerendering", extended.prerendering);
  getter("featurePolicy", extended.featurePolicy);
  getter("webkitVisibilityState", extended.webkitVisibilityState);
  getter("webkitHidden", extended.webkitHidden);
  installDocumentLifecycleEventMembers(accessor);
  getter("timeline", extended.timeline);
  getter("fullscreenEnabled", extended.fullscreenEnabled);
  getter("fullscreen", extended.fullscreen);
  installDocumentFullscreenEventMembers(accessor);
  getter("webkitIsFullScreen", extended.webkitIsFullScreen);
  getter("webkitCurrentFullScreenElement", extended.webkitCurrentFullScreenElement);
  getter("webkitFullscreenEnabled", extended.webkitFullscreenEnabled);
  getter("webkitFullscreenElement", extended.webkitFullscreenElement);
  installDocumentWebkitFullscreenEventMembers(accessor);
  getter("rootElement", extended.rootElement);
  getter("pictureInPictureEnabled", extended.pictureInPictureEnabled);
  installDocumentMainEventMembers(accessor);
  getter("children", extended.children);
  getter("firstElementChild", extended.firstElementChild);
  getter("lastElementChild", extended.lastElementChild);
  getter("childElementCount", extended.childElementCount);
  getter("activeElement", extended.activeElement);
  getter("styleSheets", extended.styleSheets);
  getter("pointerLockElement", extended.pointerLockElement);
  getter("fullscreenElement", extended.fullscreenElement);
  accessor(
    "adoptedStyleSheets",
    extended.adoptedStyleSheets,
    extended.setAdoptedStyleSheets,
  );
  getter("pictureInPictureElement", extended.pictureInPictureElement);
  getter("fonts", extended.fonts);

  installDocumentAdoptNode();
  method("append", methods.append);
  method("captureEvents", methods.captureEvents);
  method("caretPositionFromPoint", methods.caretPositionFromPoint);
  method("caretRangeFromPoint", methods.caretRangeFromPoint);
  method("clear", methods.clear);
  method("close", methods.close);
  installDocumentCreateAttribute();
  installDocumentCreateAttributeNS();
  installDocumentCreateCDATASection();
  installDocumentCreateComment();
  installDocumentCreateDocumentFragment();
  installDocumentCreateElement();
  installDocumentCreateElementNS();
  installDocumentCreateEvent();
  method("createExpression", methods.createExpression);
  method("createNSResolver", methods.createNSResolver);
  installDocumentCreateNodeIterator();
  installDocumentCreateProcessingInstruction();
  installDocumentCreateRange();
  installDocumentCreateTextNode();
  installDocumentCreateTreeWalker();
  method("elementFromPoint", methods.elementFromPoint);
  method("elementsFromPoint", methods.elementsFromPoint);
  method("evaluate", methods.evaluate);
  method("execCommand", methods.execCommand);
  method("exitFullscreen", methods.exitFullscreen);
  method("exitPictureInPicture", methods.exitPictureInPicture);
  method("exitPointerLock", methods.exitPointerLock);
  method("getAnimations", methods.getAnimations);
  installDocumentGetElementById();
  installDocumentGetElementsByClassName();
  method("getElementsByName", methods.getElementsByName);
  installDocumentGetElementsByTagName();
  method("getElementsByTagNameNS", methods.getElementsByTagNameNS);
  installDocumentGetSelection();
  method("hasFocus", methods.hasFocus);
  method("hasStorageAccess", methods.hasStorageAccess);
  method(
    "hasUnpartitionedCookieAccess",
    methods.hasUnpartitionedCookieAccess,
  );
  installDocumentImportNode();
  method("moveBefore", methods.moveBefore);
  method("open", methods.open);
  method("prepend", methods.prepend);
  method("queryCommandEnabled", methods.queryCommandEnabled);
  method("queryCommandIndeterm", methods.queryCommandIndeterm);
  method("queryCommandState", methods.queryCommandState);
  method("queryCommandSupported", methods.queryCommandSupported);
  method("queryCommandValue", methods.queryCommandValue);
  installDocumentQuerySelector();
  installDocumentQuerySelectorAll();
  method("releaseEvents", methods.releaseEvents);
  method("replaceChildren", methods.replaceChildren);
  method("requestStorageAccess", methods.requestStorageAccess);
  method("requestStorageAccessFor", methods.requestStorageAccessFor);
  method("startViewTransition", methods.startViewTransition);
  method("webkitCancelFullScreen", methods.webkitCancelFullScreen);
  method("webkitExitFullscreen", methods.webkitExitFullscreen);
  method("write", methods.write);
  method("writeln", methods.writeln);
  finishDocumentConstructor();
  getter("fragmentDirective", extended.fragmentDirective);
  installDocumentPostConstructorEventMembers(accessor);
  method("browsingTopics", methods.browsingTopics);
  method("hasPrivateToken", methods.hasPrivateToken);
  method("hasRedemptionRecord", methods.hasRedemptionRecord);
  getter("activeViewTransition", extended.activeViewTransition);
  installDocumentLateEventMembers(accessor);
  getter("customElementRegistry", extended.customElementRegistry);
  method("ariaNotify", methods.ariaNotify);
  finishDocumentToStringTag();
  finishDocumentUnscopables();
  createDocument();
  Object.defineProperty(globalThis, "document", {
    get: globalDocument,
    enumerable: true,
    configurable: true,
  });
}

function getter(name, callback) {
  definePrototypeGetter(Document.prototype, name, callback);
}

function accessor(name, get, set) {
  definePrototypeAccessor(Document.prototype, name, get, set);
}

function method(name, callback) {
  definePrototypeMethod(Document.prototype, name, callback);
}
