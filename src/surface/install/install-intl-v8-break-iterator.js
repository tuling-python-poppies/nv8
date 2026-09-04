import {
  createNativeFunction,
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

const states = new WeakMap();
const validTypes = new Set(["character", "word", "sentence", "line"]);
const segmenterGranularity = new Map([
  ["character", "grapheme"],
  ["word", "word"],
  ["sentence", "sentence"],
  // Segmenter has no line mode. Word boundaries are the closest local
  // fallback, while the adapter remains explicitly separate from V8.
  ["line", "word"],
]);
const intlPropertyOrder = [
  "getCanonicalLocales",
  "supportedValuesOf",
  "DateTimeFormat",
  "NumberFormat",
  "Collator",
  "v8BreakIterator",
  "PluralRules",
  "RelativeTimeFormat",
  "ListFormat",
  "Locale",
  "DisplayNames",
  "Segmenter",
  "DurationFormat",
];

function requireState(receiver) {
  const state = states.get(receiver);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

function breakTypeForSegment(state, item) {
  const segment = item.segment;
  if (state.type === "sentence") {
    return /[.!?\u3002\uFF01\uFF1F]["'\u201D\u2019)]*$/u.test(segment)
      ? "term"
      : "none";
  }
  if (item.isWordLike !== true) return "none";
  if (/^\p{Number}+$/u.test(segment)) return "number";
  if (/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/u.test(segment)) {
    return "ideo";
  }
  return "letter";
}

function buildBoundaries(state) {
  return Array.from(state.segmenter.segment(state.text), item => ({
    position: item.index + item.segment.length,
    type: breakTypeForSegment(state, item),
  }));
}

function defineMethod(prototype, name, length, implementation) {
  const method = createNativeFunction(name, length, implementation);
  Object.defineProperty(prototype, name, {
    value: method,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

function defineAccessor(prototype, name, length, implementation) {
  const method = createNativeFunction(name, length, implementation);
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      requireState(this);
      return method;
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  Object.defineProperty(prototype, name, {
    get: descriptor.get,
    enumerable: false,
    configurable: true,
  });
}

function moveIntlProperty(intl, name) {
  const descriptor = Object.getOwnPropertyDescriptor(intl, name);
  if (descriptor?.configurable) Reflect.deleteProperty(intl, name);
  if (descriptor !== undefined) Object.defineProperty(intl, name, descriptor);
}

function reorderIntlProperties(intl) {
  moveIntlProperty(intl, intlPropertyOrder[0]);
  moveIntlProperty(intl, intlPropertyOrder[1]);
  moveIntlProperty(intl, intlPropertyOrder[2]);
  moveIntlProperty(intl, intlPropertyOrder[3]);
  moveIntlProperty(intl, intlPropertyOrder[4]);
  moveIntlProperty(intl, intlPropertyOrder[5]);
  moveIntlProperty(intl, intlPropertyOrder[6]);
  moveIntlProperty(intl, intlPropertyOrder[7]);
  moveIntlProperty(intl, intlPropertyOrder[8]);
  moveIntlProperty(intl, intlPropertyOrder[9]);
  moveIntlProperty(intl, intlPropertyOrder[10]);
  moveIntlProperty(intl, intlPropertyOrder[11]);
  moveIntlProperty(intl, intlPropertyOrder[12]);
}

function installConstructor(intl) {
  const Segmenter = intl.Segmenter;
  const prototype = Object.create(Object.prototype);

  function V8BreakIterator(locales, options) {
    if (!new.target) {
      throw new TypeError("Constructor Intl.v8BreakIterator requires 'new'");
    }
    const optionRecord = options === undefined ? {} : Object(options);
    const type = optionRecord.type === undefined
      ? "word"
      : `${optionRecord.type}`;
    if (!validTypes.has(type)) {
      throw new RangeError(`Invalid break iterator type: ${type}`);
    }
    const segmenter = new Segmenter(locales, {
      granularity: segmenterGranularity.get(type),
    });
    states.set(this, {
      segmenter,
      text: "",
      type,
      boundaries: [],
      nextIndex: 0,
      current: 0,
      breakType: "none",
    });
  }

  Object.defineProperty(V8BreakIterator, "name", {
    value: "v8BreakIterator",
    configurable: true,
  });
  Object.defineProperty(V8BreakIterator, "length", {
    value: 0,
    configurable: true,
  });
  registerNativeFunction(V8BreakIterator, "v8BreakIterator");

  Object.defineProperty(prototype, "constructor", {
    value: V8BreakIterator,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  defineMethod(prototype, "resolvedOptions", 0, function () {
    const state = requireState(this);
    return {
      locale: state.segmenter.resolvedOptions().locale,
      type: state.type,
    };
  });
  defineAccessor(prototype, "adoptText", 1, function (text) {
    const state = requireState(this);
    state.text = `${text}`;
    state.boundaries = buildBoundaries(state);
    state.nextIndex = 0;
    state.current = 0;
    state.breakType = "none";
    return undefined;
  });
  defineAccessor(prototype, "first", 0, function () {
    const state = requireState(this);
    state.nextIndex = 0;
    state.current = 0;
    state.breakType = "none";
    return 0;
  });
  defineAccessor(prototype, "next", 0, function () {
    const state = requireState(this);
    const boundary = state.boundaries[state.nextIndex++];
    if (boundary === undefined) {
      state.breakType = "none";
      return -1;
    }
    state.current = boundary.position;
    state.breakType = boundary.type;
    return boundary.position;
  });
  defineAccessor(prototype, "current", 0, function () {
    return requireState(this).current;
  });
  defineAccessor(prototype, "breakType", 0, function () {
    return requireState(this).breakType;
  });

  Object.defineProperty(V8BreakIterator, "prototype", {
    value: prototype,
    writable: false,
    enumerable: false,
    configurable: false,
  });
  const supportedLocalesOf = createNativeFunction(
    "supportedLocalesOf",
    1,
    (locales, options) => Reflect.apply(
      Segmenter.supportedLocalesOf,
      Segmenter,
      [locales, options],
    ),
  );
  Object.defineProperty(V8BreakIterator, "supportedLocalesOf", {
    value: supportedLocalesOf,
    writable: true,
    enumerable: false,
    configurable: true,
  });

  Object.defineProperty(intl, "v8BreakIterator", {
    value: V8BreakIterator,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  reorderIntlProperties(intl);
}

export function installIntlV8BreakIterator(edge151Surface = false) {
  if (!edge151Surface) return;
  const intl = globalThis.Intl;
  if (intl === null || typeof intl !== "object") return;
  if (typeof intl.v8BreakIterator === "function") return;
  if (typeof intl.Segmenter !== "function") return;
  installConstructor(intl);
}
