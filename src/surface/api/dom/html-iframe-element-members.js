import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";
import { createDOMTokenList } from "./dom-token-list-state.js";
import { HTMLIFrameElement } from "./html-iframe-element-constructor.js";
import {
  htmlBooleanDescriptor,
  htmlReadonlyDescriptor,
  htmlStringDescriptor,
} from "./html-element-property.js";
import {
  iframeContentDocument,
  iframeContentWindow,
  iframeSVGDocument,
} from "./html-iframe-element-realm-state.js";
import {
  createFeaturePolicy,
} from "../feature-policy/feature-policy-runtime.js";

const sandboxLists = new WeakMap();
const featurePolicies = new WeakMap();

export function installHTMLIFrameElementMembers() {
  for (const name of ["src", "srcdoc", "name"]) installString(name);
  definePrototypeGetter(
    HTMLIFrameElement.prototype,
    "sandbox",
    iframeGetter("sandbox", element => {
      let result = sandboxLists.get(element);
      if (result === undefined) {
        result = createDOMTokenList(element, "sandbox");
        sandboxLists.set(element, result);
      }
      return result;
    }),
  );
  installBoolean("allowFullscreen");
  for (const name of ["width", "height"]) installString(name);
  installReadonly("contentDocument", iframeContentDocument);
  installReadonly("contentWindow", iframeContentWindow);
  for (const name of [
    "referrerPolicy",
    "csp",
    "allow",
  ]) installString(name);
  installReadonly("featurePolicy", element => {
    let policy = featurePolicies.get(element);
    if (policy === undefined) {
      policy = createFeaturePolicy();
      featurePolicies.set(element, policy);
    }
    return policy;
  });
  for (const name of [
    "loading",
    "align",
    "scrolling",
    "frameBorder",
    "longDesc",
    "marginHeight",
    "marginWidth",
  ]) installString(name);
  const getSVGDocument = function getSVGDocument() {
    if (!(this instanceof HTMLIFrameElement)) throw new TypeError("Illegal invocation");
    return iframeSVGDocument(this);
  };
  registerNativeFunction(getSVGDocument, "getSVGDocument");
  definePrototypeMethod(
    HTMLIFrameElement.prototype,
    "getSVGDocument",
    getSVGDocument,
  );
  installBoolean("credentialless");
  installBoolean("allowPaymentRequest");
  defineConstructorBacklink(HTMLIFrameElement.prototype, HTMLIFrameElement);
  installString("privateToken");
  installBoolean("browsingTopics");
  installBoolean("adAuctionHeaders");
  installBoolean("sharedStorageWritable");
  defineToStringTag(HTMLIFrameElement.prototype, "HTMLIFrameElement");
}

function installString(name) {
  const descriptor = htmlStringDescriptor(name);
  definePrototypeAccessor(
    HTMLIFrameElement.prototype,
    name,
    descriptor.get,
    descriptor.set,
  );
}

function installBoolean(name) {
  const descriptor = htmlBooleanDescriptor(name);
  definePrototypeAccessor(
    HTMLIFrameElement.prototype,
    name,
    descriptor.get,
    descriptor.set,
  );
}

function installReadonly(name, operation) {
  const descriptor = htmlReadonlyDescriptor(
    name,
    typeof operation === "function" ? operation : () => operation,
  );
  definePrototypeGetter(
    HTMLIFrameElement.prototype,
    name,
    descriptor.get,
  );
}

function iframeGetter(name, operation) {
  const getter = function () {
    if (!(this instanceof HTMLIFrameElement)) throw new TypeError("Illegal invocation");
    return operation(this);
  };
  registerNativeGetter(getter, name);
  return getter;
}
