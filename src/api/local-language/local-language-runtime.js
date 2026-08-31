import { encodeUtf8 } from "../file/blob-state.js";
import { ReadableStream } from "../streams/stream-runtime.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

const state = new WeakMap();

export function LanguageDetector() {
  throw new TypeError("Illegal constructor");
}
export function Summarizer() {
  throw new TypeError("Illegal constructor");
}
export function Translator() {
  throw new TypeError("Illegal constructor");
}

export const localLanguageConstructors = Object.freeze([
  LanguageDetector,
  Summarizer,
  Translator,
]);
for (const Constructor of localLanguageConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function localLanguageAvailability() {
  return Promise.resolve("available");
}

export function createLanguageDetector() {
  return Promise.resolve(create(LanguageDetector, {
    kind: "detector",
    expectedInputLanguages: [],
    inputQuota: 4096,
    destroyed: false,
  }));
}

export function createSummarizer() {
  const languages = [];
  return Promise.resolve(create(Summarizer, {
    kind: "summarizer",
    sharedContext: "",
    type: "key-points",
    format: "plain-text",
    length: "medium",
    expectedInputLanguages: languages,
    expectedContextLanguages: languages,
    outputLanguage: "en",
    inputQuota: 4096,
    destroyed: false,
  }));
}

export function createTranslator() {
  return Promise.resolve(create(Translator, {
    kind: "translator",
    inputQuota: 4096,
    sourceLanguage: "en",
    targetLanguage: "zh",
    destroyed: false,
  }));
}

export function localLanguageProperty(value, name) {
  return requireRecord(value)[name];
}

export function localLanguageOperation(value, name, args) {
  const record = requireRecord(value);
  if (name === "destroy") {
    record.destroyed = true;
    return undefined;
  }
  if (name === "measureInputUsage") {
    const input = `${args[0]}`;
    const length = record.kind === "detector"
      ? Array.from(input).length
      : encodeUtf8(input).length;
    return Promise.resolve(length);
  }
  if (record.kind === "detector" && name === "detect") {
    return Promise.resolve([
      { detectedLanguage: "en", confidence: 0.99 },
    ]);
  }
  if (record.kind === "summarizer" && name === "summarize") {
    const summary = `${args[0]}`.trim().split(/\s+/u).filter(Boolean)
      .slice(0, 32).join(" ");
    return Promise.resolve(summary);
  }
  if (record.kind === "summarizer" && name === "summarizeStreaming") {
    return new ReadableStream();
  }
  if (record.kind === "translator" && name === "translate") {
    return Promise.resolve(`${args[0]}`);
  }
  if (record.kind === "translator" && name === "translateStreaming") {
    return new ReadableStream();
  }
  throw new TypeError(`Unsupported local language operation: ${name}`);
}

function create(Constructor, record) {
  const value = Object.create(Constructor.prototype);
  state.set(value, record);
  return value;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}
