import { requireDocument } from "../dom/document-record.js";
import {
  createDocumentFragment,
} from "../dom/document-fragment-constructor.js";
import { serializeNode } from "../dom/html-serializer.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
const sanitizerState = new WeakMap();
const processorState = new WeakMap();

export function Sanitizer() {
  if (new.target === undefined) {
    throw new TypeError(
      "Failed to construct 'Sanitizer': Please use the 'new' operator, this DOM object constructor cannot be called as a function.",
    );
  }
  sanitizerState.set(
    this,
    arguments[0] === undefined
      ? defaultSanitizerConfig()
      : parseSanitizerConfig(arguments[0]),
  );
}

export function XSLTProcessor() {
  if (new.target === undefined) {
    throw new TypeError(
      "Failed to construct 'XSLTProcessor': Please use the 'new' operator, this DOM object constructor cannot be called as a function.",
    );
  }
  processorState.set(this, {
    stylesheet: null,
    parameters: new Map(),
  });
}

for (const Constructor of [Sanitizer, XSLTProcessor]) {
  registerNativeFunction(Constructor, Constructor.name);
}
export const documentProcessingConstructors = Object.freeze([
  Sanitizer,
  XSLTProcessor,
]);

export function sanitizerOperation(value, name, args) {
  const config = requireSanitizer(value);
  if (name === "get") return sanitizerConfigSnapshot(config);
  if (name === "setComments") {
    config.comments = Boolean(args[0]);
    return undefined;
  }
  if (name === "setDataAttributes") {
    config.dataAttributes = Boolean(args[0]);
    return undefined;
  }
  if (name === "removeUnsafe") {
    for (const element of ["script", "iframe", "object", "embed"]) {
      removeElement(config, htmlName(element));
    }
    for (const attribute of ["onclick", "onerror", "onload"]) {
      removeAttribute(config, attributeName(attribute));
    }
    return undefined;
  }
  const element = [
    "allowElement",
    "removeElement",
    "replaceElementWithChildren",
  ].includes(name);
  const entry = requireSanitizerName(args, name, element);
  if (entry === undefined) return undefined;
  if (name === "allowElement") allowElement(config, entry);
  else if (name === "removeElement") removeElement(config, entry);
  else if (name === "replaceElementWithChildren") {
    replaceElementWithChildren(config, entry);
  } else if (name === "allowAttribute") allowAttribute(config, entry);
  else if (name === "removeAttribute") removeAttribute(config, entry);
  else if (name === "allowProcessingInstruction") {
    allowProcessingInstruction(config, entry);
  } else if (name === "removeProcessingInstruction") {
    removeProcessingInstruction(config, entry);
  }
  return undefined;
}

export function xsltOperation(value, name, args) {
  const state = requireProcessor(value);
  if (name === "clearParameters") {
    state.parameters.clear();
    return undefined;
  }
  if (name === "getParameter") {
    return state.parameters.get(parameterKey(args)) ?? null;
  }
  if (name === "setParameter") {
    if (args.length < 3) {
      throw new TypeError("setParameter requires 3 arguments");
    }
    state.parameters.set(parameterKey(args), args[2]);
    return undefined;
  }
  if (name === "removeParameter") {
    state.parameters.delete(parameterKey(args));
    return undefined;
  }
  if (name === "importStylesheet") {
    state.stylesheet = serializedDocument(args[0], "The stylesheet must be an XML Document");
    return undefined;
  }
  if (name === "reset") {
    state.stylesheet = null;
    state.parameters.clear();
    return undefined;
  }
  const source = serializedDocument(
    args[0],
    `${name} requires a Node`,
  );
  const output = applyStylesheet(source, state);
  if (name === "transformToDocument") {
    return new globalThis.DOMParser().parseFromString(
      output,
      "application/xml",
    );
  }
  if (name === "transformToFragment") {
    const owner = documentValue(args[1]) ?? globalThis.document;
    const fragment = createDocumentFragment(owner);
    fragment.textContent = stripTags(output);
    return fragment;
  }
  throw new TypeError(`Unsupported XSLTProcessor operation: ${name}`);
}

function defaultSanitizerConfig() {
  return {
    elements: [
      "a", "abbr", "article", "b", "blockquote", "br", "code", "div",
      "em", "figure", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "i",
      "li", "main", "mark", "ol", "p", "pre", "section", "small", "span",
      "strong", "sub", "sup", "table", "tbody", "td", "th", "thead", "tr",
      "u", "ul",
    ].map(htmlName),
    removeElements: [],
    replaceWithChildrenElements: [],
    attributes: ["class", "dir", "href", "id", "lang", "title"]
      .map(attributeName),
    removeAttributes: [],
    processingInstructions: [],
    removeProcessingInstructions: [],
    comments: false,
    dataAttributes: false,
  };
}

function parseSanitizerConfig(input) {
  if (!isObject(input)) {
    throw new TypeError(
      "Failed to construct 'Sanitizer': Invalid Sanitizer configuration.",
    );
  }
  const config = {
    elements: namesProperty(input.elements, true),
    removeElements: namesProperty(input.removeElements, true) ?? [],
    replaceWithChildrenElements:
      namesProperty(input.replaceWithChildrenElements, true) ?? [],
    attributes: namesProperty(input.attributes, false),
    removeAttributes: namesProperty(input.removeAttributes, false) ?? [],
    processingInstructions:
      namesProperty(input.processingInstructions, false),
    removeProcessingInstructions:
      namesProperty(input.removeProcessingInstructions, false) ?? [],
    comments: input.comments === undefined ? undefined : Boolean(input.comments),
    dataAttributes: input.dataAttributes === undefined
      ? undefined
      : Boolean(input.dataAttributes),
  };
  if (
    (config.elements !== undefined
      && (config.removeElements.length > 0
        || config.replaceWithChildrenElements.length > 0))
    || (config.attributes !== undefined
      && config.removeAttributes.length > 0)
    || (config.processingInstructions !== undefined
      && config.removeProcessingInstructions.length > 0)
  ) {
    throw new TypeError(
      "Failed to construct 'Sanitizer': Invalid Sanitizer configuration.",
    );
  }
  return config;
}

function namesProperty(value, element) {
  if (value === undefined || !Array.isArray(value)) return undefined;
  const result = [];
  for (const item of value) {
    const entry = parseName(item, element);
    if (entry !== undefined) addUnique(result, entry);
  }
  return result;
}

function requireSanitizerName(args, method, element) {
  if (args.length === 0) {
    throw new TypeError(
      `Failed to execute '${method}' on 'Sanitizer': `
        + "1 argument required, but only 0 present.",
    );
  }
  return parseName(args[0], element);
}

function parseName(value, element) {
  if (typeof value === "string") {
    return element ? htmlName(value) : attributeName(value);
  }
  if (!isObject(value) || value.name === undefined) return undefined;
  return {
    name: `${value.name}`,
    namespace: value.namespace === null || value.namespace === undefined
      ? null
      : `${value.namespace}`,
  };
}

function htmlName(name) {
  return { name: `${name}`, namespace: HTML_NAMESPACE };
}

function attributeName(name) {
  return { name: `${name}`, namespace: null };
}

function allowElement(config, entry) {
  removeName(config.removeElements, entry);
  removeName(config.replaceWithChildrenElements, entry);
  if (config.elements !== undefined) addUnique(config.elements, entry);
}

function removeElement(config, entry) {
  removeName(config.replaceWithChildrenElements, entry);
  if (config.elements !== undefined) removeName(config.elements, entry);
  else addUnique(config.removeElements, entry);
}

function replaceElementWithChildren(config, entry) {
  removeName(config.removeElements, entry);
  if (config.elements !== undefined) removeName(config.elements, entry);
  addUnique(config.replaceWithChildrenElements, entry);
}

function allowAttribute(config, entry) {
  removeName(config.removeAttributes, entry);
  if (config.attributes !== undefined) addUnique(config.attributes, entry);
}

function removeAttribute(config, entry) {
  if (config.attributes !== undefined) removeName(config.attributes, entry);
  else addUnique(config.removeAttributes, entry);
}

function allowProcessingInstruction(config, entry) {
  removeName(config.removeProcessingInstructions, entry);
  if (config.processingInstructions !== undefined) {
    addUnique(config.processingInstructions, entry);
  }
}

function removeProcessingInstruction(config, entry) {
  if (config.processingInstructions !== undefined) {
    removeName(config.processingInstructions, entry);
  } else {
    addUnique(config.removeProcessingInstructions, entry);
  }
}

function sanitizerConfigSnapshot(config) {
  const result = {};
  defineNames(result, "attributes", config.attributes);
  if (config.comments !== undefined) result.comments = config.comments;
  if (config.dataAttributes !== undefined) {
    result.dataAttributes = config.dataAttributes;
  }
  defineNames(result, "elements", config.elements);
  defineNames(
    result,
    "processingInstructions",
    config.processingInstructions,
  );
  defineNames(result, "removeAttributes", config.removeAttributes, true);
  defineNames(result, "removeElements", config.removeElements, true);
  defineNames(
    result,
    "removeProcessingInstructions",
    config.removeProcessingInstructions,
    true,
  );
  defineNames(
    result,
    "replaceWithChildrenElements",
    config.replaceWithChildrenElements,
    true,
  );
  return result;
}

function defineNames(output, name, values, onlyWhenNonEmpty = false) {
  if (
    values === undefined
    || (onlyWhenNonEmpty && values.length === 0)
  ) return;
  output[name] = values.map(cloneName);
}

function cloneName(value) {
  return { name: value.name, namespace: value.namespace };
}

function addUnique(values, entry) {
  if (!values.some(value => sameName(value, entry))) values.push(entry);
}

function removeName(values, entry) {
  const index = values.findIndex(value => sameName(value, entry));
  if (index !== -1) values.splice(index, 1);
}

function sameName(left, right) {
  return left.name === right.name && left.namespace === right.namespace;
}

function requireSanitizer(value) {
  const config = sanitizerState.get(value);
  if (config === undefined) throw new TypeError("Illegal invocation");
  return config;
}

function requireProcessor(value) {
  const state = processorState.get(value);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

function parameterKey(args) {
  return `${args[0]}\u0000${args[1]}`;
}

function serializedDocument(value, message) {
  try {
    requireDocument(value);
  } catch {
    throw new TypeError(message);
  }
  return serializeNode(value);
}

function documentValue(value) {
  try {
    requireDocument(value);
    return value;
  } catch {
    return null;
  }
}

function applyStylesheet(source, state) {
  if (state.stylesheet === null) return source;
  let output = templateBody(state.stylesheet) ?? state.stylesheet;
  output = output.replace(
    /<(?:xsl:)?value-of\b[^>]*\bselect=(["'])(.*?)\1[^>]*>/giu,
    (_match, _quote, select) => {
      const value = select.startsWith("$")
        ? parameterByLocalName(state.parameters, select.slice(1))
        : selectPath(source, select);
      return escapeXML(`${value ?? ""}`);
    },
  );
  return output
    .replace(/<\/(?:xsl:)?value-of>/giu, "")
    .replaceAll('<?xml version="1.0"?>', "");
}

function templateBody(stylesheet) {
  return /<(?:xsl:)?template\b[^>]*>([\s\S]*?)<\/(?:xsl:)?template>/iu
    .exec(stylesheet)?.[1] ?? null;
}

function parameterByLocalName(parameters, name) {
  for (const [key, value] of parameters) {
    if (key.slice(key.indexOf("\u0000") + 1) === name) return value;
  }
  return "";
}

function selectPath(source, select) {
  const name = select
    .replace(/^\/+|\/+$/gu, "")
    .split("/")
    .filter(Boolean)
    .at(-1) ?? select;
  const open = `<${name}>`;
  const close = `</${name}>`;
  const start = source.indexOf(open);
  if (start === -1) return "";
  const contentStart = start + open.length;
  const end = source.indexOf(close, contentStart);
  return end === -1 ? "" : source.slice(contentStart, end);
}

function stripTags(source) {
  return source.replace(/<[^>]*>/gu, "");
}

function escapeXML(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function isObject(value) {
  return (typeof value === "object" && value !== null)
    || typeof value === "function";
}
