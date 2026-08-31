import {
  createCSSStyleDeclaration,
  parseCSSDeclarations,
  serializeCSSDeclarations,
} from "../css/css-style-declaration-state.js";
import {
  createCSSStyleValue,
  requireCSSStyleValue,
} from "../css/css-style-value-state.js";
import { createStylePropertyMap } from "../css/style-property-map-state.js";
import {
  attributeNames,
  getAttributeValue,
  removeAttributeValue,
  requireElement,
  setAttributeValue,
} from "../dom/element-state.js";
import { elementHandlerProperty } from "../dom/element-extended-property.js";
import { documentBody, requireDocument } from "../dom/document-record.js";
import { requireNode } from "../dom/node-state.js";
import { SVGElement } from "../dom/svg-element-constructor.js";
import { createSVGAttributeGetter } from "./svg-attribute-members.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../webidl/native-function.js";
import {
  defineConstructorBacklink,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../webidl/descriptor.js";

const state = new WeakMap();

const earlyEventNames = [
  "onabort", "onbeforeinput", "onbeforematch", "onbeforetoggle", "onblur",
  "oncancel", "oncanplay", "oncanplaythrough", "onchange", "onclick",
  "onclose", "oncommand", "oncontentvisibilityautostatechange",
  "oncontextlost", "oncontextmenu", "oncontextrestored", "oncuechange",
  "ondblclick", "ondrag", "ondragend", "ondragenter", "ondragleave",
  "ondragover", "ondragstart", "ondrop", "ondurationchange", "onemptied",
  "onended", "onerror", "onfocus", "onformdata", "oninput", "oninvalid",
  "onkeydown", "onkeypress", "onkeyup", "onload", "onloadeddata",
  "onloadedmetadata", "onloadstart", "onmousedown", "onmouseenter",
  "onmouseleave", "onmousemove", "onmouseout", "onmouseover", "onmouseup",
  "onmousewheel", "onpause", "onplay", "onplaying", "onprogress",
  "onratechange", "onreset", "onresize", "onscroll", "onscrollend",
  "onsecuritypolicyviolation", "onseeked", "onseeking", "onselect",
  "onslotchange", "onstalled", "onsubmit", "onsuspend", "ontimeupdate",
  "ontoggle", "onvolumechange", "onwaiting", "onwebkitanimationend",
  "onwebkitanimationiteration", "onwebkitanimationstart",
  "onwebkittransitionend", "onwheel", "onauxclick", "ongotpointercapture",
  "onlostpointercapture", "onpointerdown", "onpointermove", "onpointerup",
  "onpointercancel", "onpointerover", "onpointerout", "onpointerenter",
  "onpointerleave", "onselectstart", "onselectionchange",
  "onanimationcancel", "onanimationend", "onanimationiteration",
  "onanimationstart", "ontransitionrun", "ontransitionstart",
  "ontransitionend", "ontransitioncancel", "onbeforexrselect", "oncopy",
  "oncut", "onpaste",
];

export function installSVGElementMembers() {
  definePrototypeGetter(
    SVGElement.prototype,
    "className",
    createSVGAttributeGetter("SVGElement", "className", "string", "class", ""),
  );
  definePrototypeGetter(
    SVGElement.prototype,
    "ownerSVGElement",
    viewportGetter("ownerSVGElement"),
  );
  definePrototypeGetter(
    SVGElement.prototype,
    "viewportElement",
    viewportGetter("viewportElement"),
  );
  for (const name of earlyEventNames) installEventAccessor(name);
  definePrototypeGetter(SVGElement.prototype, "dataset", readonlyGetter("dataset", dataset));
  installStringAccessor("nonce", "nonce");
  installBooleanAccessor("autofocus", "autofocus");
  installNumberAccessor("tabIndex", "tabindex", -1);
  definePrototypeGetter(SVGElement.prototype, "style", readonlyGetter("style", style));
  definePrototypeGetter(
    SVGElement.prototype,
    "attributeStyleMap",
    readonlyGetter("attributeStyleMap", attributeStyleMap),
  );
  definePrototypeMethod(SVGElement.prototype, "blur", focusMethod("blur"));
  definePrototypeMethod(SVGElement.prototype, "focus", focusMethod("focus"));
  installEventAccessor("onscrollsnapchange");
  installEventAccessor("onscrollsnapchanging");
  installStringAccessor("focusGroup", "focusgroup");
  installStringAccessor("focusGroupStart", "focusgroupstart");
  defineConstructorBacklink(SVGElement.prototype, SVGElement);
  installEventAccessor("onpointerrawupdate");
  defineToStringTag(SVGElement.prototype, "SVGElement");
}

function installEventAccessor(name) {
  const descriptor = elementHandlerProperty(name);
  definePrototypeAccessor(
    SVGElement.prototype,
    name,
    descriptor.get,
    descriptor.set,
  );
}

function viewportGetter(name) {
  const getter = function () {
    requireSVGElement(this);
    let current = requireNode(this).parent;
    while (current !== null) {
      const element = tryElement(current);
      if (element?.namespaceURI === "http://www.w3.org/2000/svg"
        && element.localName === "svg") return current;
      current = requireNode(current).parent;
    }
    return null;
  };
  registerNativeGetter(getter, name);
  return getter;
}

function installStringAccessor(name, attributeName) {
  const getter = function () {
    requireSVGElement(this);
    return getAttributeValue(this, attributeName) ?? "";
  };
  registerNativeGetter(getter, name);
  definePrototypeAccessor(SVGElement.prototype, name, getter, function (value) {
    requireSVGElement(this);
    setAttributeValue(this, attributeName, `${value}`);
  });
}

function installBooleanAccessor(name, attributeName) {
  const getter = function () {
    requireSVGElement(this);
    return getAttributeValue(this, attributeName) !== null;
  };
  registerNativeGetter(getter, name);
  definePrototypeAccessor(SVGElement.prototype, name, getter, function (value) {
    requireSVGElement(this);
    if (Boolean(value)) setAttributeValue(this, attributeName, "");
    else removeAttributeValue(this, attributeName);
  });
}

function installNumberAccessor(name, attributeName, fallback) {
  const getter = function () {
    requireSVGElement(this);
    const source = getAttributeValue(this, attributeName);
    return source === null ? fallback : Number.parseInt(source, 10) || 0;
  };
  registerNativeGetter(getter, name);
  definePrototypeAccessor(SVGElement.prototype, name, getter, function (value) {
    requireSVGElement(this);
    setAttributeValue(this, attributeName, `${Math.trunc(Number(value) || 0)}`);
  });
}

function readonlyGetter(name, operation) {
  const getter = function () {
    requireSVGElement(this);
    return operation(this);
  };
  registerNativeGetter(getter, name);
  return getter;
}

function record(element) {
  requireSVGElement(element);
  let result = state.get(element);
  if (result === undefined) {
    result = { dataset: null, style: null, styleMap: null };
    state.set(element, result);
  }
  return result;
}

function dataset(element) {
  const current = record(element);
  if (current.dataset === null) current.dataset = {};
  for (const attributeName of attributeNames(element).filter(name => name.startsWith("data-"))) {
    const propertyName = attributeName.slice(5)
      .replace(/-([a-z])/gu, (_match, letter) => letter.toUpperCase());
    if (!Object.hasOwn(current.dataset, propertyName)) {
      Object.defineProperty(current.dataset, propertyName, {
        get() { return getAttributeValue(element, attributeName) ?? ""; },
        set(value) { setAttributeValue(element, attributeName, `${value}`); },
        enumerable: true,
        configurable: true,
      });
    }
  }
  return current.dataset;
}

function style(element) {
  const current = record(element);
  if (current.style === null) current.style = createCSSStyleDeclaration(element);
  return current.style;
}

function attributeStyleMap(element) {
  const current = record(element);
  if (current.styleMap === null) {
    current.styleMap = createStylePropertyMap(
      () => new Map([...parseCSSDeclarations(
        getAttributeValue(element, "style") ?? "",
      )].map(([name, declaration]) => [
        name,
        [createCSSStyleValue(declaration.value)],
      ])),
      map => {
        const declarations = new Map();
        for (const [name, values] of map) {
          const value = values.map(requireCSSStyleValue).join(", ");
          if (value !== "") declarations.set(name, { value, priority: "" });
        }
        const text = serializeCSSDeclarations(declarations);
        if (text === "") removeAttributeValue(element, "style");
        else setAttributeValue(element, "style", text);
      },
    );
  }
  return current.styleMap;
}

function focusMethod(type) {
  const callback = {
    [type]() {
      requireSVGElement(this);
      const document = requireNode(this).ownerDocument;
      if (document !== null) {
        const documentRecord = requireDocument(document);
        if (type === "focus") documentRecord.activeElement = this;
        else if (documentRecord.activeElement === this) {
          documentRecord.activeElement = documentBody(document);
        }
      }
      const event = new Event(type);
      this.dispatchEvent(event);
      const handler = requireElement(this).handlers.get(`on${type}`) ?? null;
      if (handler !== null) Reflect.apply(handler, this, [event]);
    },
  }[type];
  registerNativeFunction(callback, type);
  return callback;
}

function requireSVGElement(value) {
  const element = requireElement(value);
  if (element.namespaceURI !== "http://www.w3.org/2000/svg") {
    throw new TypeError("Illegal invocation");
  }
  return element;
}

function tryElement(value) {
  try {
    return requireElement(value);
  } catch {
    return null;
  }
}
