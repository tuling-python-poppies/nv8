import { assignEventHandler } from "../event/event-handler-attribute.js";
import {
  attributeNames,
  getAttributeValue,
  removeAttributeValue,
  requireElement,
  setAttributeValue,
} from "./element-state.js";
import { createCSSStyleDeclaration } from "../css/css-style-declaration-state.js";
import {
  parseCSSDeclarations,
  serializeCSSDeclarations,
} from "../css/css-style-declaration-state.js";
import { requireCSSStyleValue, createCSSStyleValue } from "../css/css-style-value-state.js";
import { createStylePropertyMap } from "../css/style-property-map-state.js";
import { createElementInternals } from "./element-internals-state.js";

const state = new WeakMap();

export function requireHTMLElement(value) {
  const element = requireElement(value);
  if (element.namespaceURI !== "http://www.w3.org/1999/xhtml") {
    throw new TypeError("Illegal invocation");
  }
  let record = state.get(value);
  if (record === undefined) {
    record = {
      editContext: null,
      handlers: new Map(),
      // on* 属性注册的代理监听器，见 event-handler-attribute.js
      handlerListeners: new Map(),
      dataset: null,
      style: null,
      styleMap: null,
      popoverVisible: false,
      internals: null,
    };
    state.set(value, record);
  }
  return record;
}

export function htmlStringProperty(element, name, defaultValue = "") {
  requireHTMLElement(element);
  return getAttributeValue(element, reflectedAttribute(name)) ?? defaultValue;
}

export function setHTMLStringProperty(element, name, value) {
  requireHTMLElement(element);
  setAttributeValue(element, reflectedAttribute(name), `${value}`);
}

export function htmlBooleanProperty(element, name, defaultValue = false) {
  requireHTMLElement(element);
  const attribute = getAttributeValue(element, reflectedAttribute(name));
  return attribute === null ? defaultValue : true;
}

export function setHTMLBooleanProperty(element, name, value) {
  requireHTMLElement(element);
  if (Boolean(value)) setAttributeValue(element, reflectedAttribute(name), "");
  else removeAttributeValue(element, reflectedAttribute(name));
}

export function htmlHandler(element, name) {
  return requireHTMLElement(element).handlers.get(name) ?? null;
}

export function setHTMLHandler(element, name, value) {
  const record = requireHTMLElement(element);
  // 处理器必须注册成真正的监听器，否则派发时不会被调用。
  assignEventHandler(element, record.handlers, record.handlerListeners, name, value);
}

export function htmlDataset(element) {
  const record = requireHTMLElement(element);
  if (record.dataset === null) {
    record.dataset = Object.create(
      globalThis.DOMStringMap?.prototype ?? Object.prototype,
    );
  }
  const names = attributeNames(element).filter(name => name.startsWith("data-"));
  for (const attributeName of names) {
    const propertyName = datasetPropertyName(attributeName);
    if (!Object.hasOwn(record.dataset, propertyName)) {
      Object.defineProperty(record.dataset, propertyName, {
        get() { return getAttributeValue(element, attributeName) ?? ""; },
        set(value) { setAttributeValue(element, attributeName, `${value}`); },
        enumerable: true,
        configurable: true,
      });
    }
  }
  return record.dataset;
}

export function htmlStyleRecord(element) {
  const record = requireHTMLElement(element);
  if (record.style === null) {
    record.style = createCSSStyleDeclaration(element);
  }
  return record.style;
}

export function htmlAttributeStyleMap(element) {
  const record = requireHTMLElement(element);
  if (record.styleMap === null) {
    record.styleMap = createStylePropertyMap(
      () => {
        const declarations = parseCSSDeclarations(getAttributeValue(element, "style") ?? "");
        return new Map([...declarations].map(([name, declaration]) => [
          name,
          [createCSSStyleValue(declaration.value)],
        ]));
      },
      map => {
        const current = parseCSSDeclarations(getAttributeValue(element, "style") ?? "");
        const declarations = new Map();
        for (const [name, values] of map) {
          const value = values.map(requireCSSStyleValue).join(", ");
          if (value !== "") {
            declarations.set(name, {
              value,
              priority: current.get(name)?.priority ?? "",
            });
          }
        }
        const text = serializeCSSDeclarations(declarations);
        if (text === "") removeAttributeValue(element, "style");
        else setAttributeValue(element, "style", text);
      },
    );
  }
  return record.styleMap;
}

export function htmlPopoverVisible(element) {
  return requireHTMLElement(element).popoverVisible;
}

export function htmlElementInternals(element) {
  const record = requireHTMLElement(element);
  if (record.internals === null) record.internals = createElementInternals(element);
  return record.internals;
}

export function setHTMLPopoverVisible(element, visible) {
  requireHTMLElement(element).popoverVisible = Boolean(visible);
}

function reflectedAttribute(name) {
  const names = {
    accessKey: "accesskey",
    autocapitalize: "autocapitalize",
    contentEditable: "contenteditable",
    enterKeyHint: "enterkeyhint",
    inputMode: "inputmode",
    virtualKeyboardPolicy: "virtualkeyboardpolicy",
    writingSuggestions: "writingsuggestions",
    focusGroup: "focusgroup",
    focusGroupStart: "focusgroupstart",
  };
  return names[name] ?? name.toLowerCase();
}

function datasetPropertyName(attributeName) {
  return attributeName.slice(5).replace(/-([a-z])/gu, (_, letter) => letter.toUpperCase());
}
