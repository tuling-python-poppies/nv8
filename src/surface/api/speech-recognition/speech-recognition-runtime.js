import { Event } from "../event/event-constructor.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import {
  SpeechRecognitionErrorEvent,
} from "../longtail-events/longtail-events-runtime.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const state = new WeakMap();
const handlerNames = Object.freeze([
  "onaudiostart",
  "onsoundstart",
  "onspeechstart",
  "onspeechend",
  "onsoundend",
  "onaudioend",
  "onresult",
  "onnomatch",
  "onerror",
  "onstart",
  "onend",
]);

export function SpeechRecognition() {
  if (new.target === undefined) {
    throw new TypeError("SpeechRecognition requires new");
  }
  initializeEventTarget(this);
  state.set(this, {
    kind: "recognition",
    object: this,
    grammars: createSpeechGrammarList(),
    lang: "",
    continuous: false,
    interimResults: false,
    maxAlternatives: 1,
    quality: "command",
    processLocally: false,
    // Edge 151 新增。真实 Edge 实测：getter+setter，默认 false。
    unspokenPunctuation: false,
    phrases: Object.freeze([]),
    started: false,
    handlers: new Map(handlerNames.map(name => [name, null])),
  });
}

export function SpeechGrammar() {
  if (new.target === undefined) throw new TypeError("SpeechGrammar requires new");
  state.set(this, { kind: "grammar", src: "", weight: 1 });
}

export function SpeechGrammarList() {
  if (new.target === undefined) {
    throw new TypeError("SpeechGrammarList requires new");
  }
  state.set(this, { kind: "grammarList", values: [] });
}

export function SpeechRecognitionPhrase(phrase) {
  if (new.target === undefined) {
    throw new TypeError("SpeechRecognitionPhrase requires new");
  }
  if (arguments.length === 0) throw new TypeError("phrase required");
  const boost = Number(arguments[1] ?? 1);
  if (!Number.isFinite(boost)) throw new TypeError("boost must be finite");
  state.set(this, {
    kind: "phrase",
    phrase: `${phrase}`,
    boost,
  });
}

export const speechRecognitionConstructors = Object.freeze([
  SpeechRecognition,
  SpeechGrammar,
  SpeechGrammarList,
  SpeechRecognitionPhrase,
]);
for (const Constructor of speechRecognitionConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function speechRecognitionProperty(value, name) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) return record.handlers.get(name);
  if (record.kind === "grammarList" && name === "length") {
    return record.values.length;
  }
  return record[name];
}

export function setSpeechRecognitionProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
    return;
  }
  if (record.kind === "recognition") {
    if (name === "grammars") {
      if (state.get(input)?.kind !== "grammarList") {
        throw new TypeError("grammars must be a SpeechGrammarList");
      }
      record.grammars = input;
    } else if ([
      "continuous",
      "interimResults",
      "processLocally",
      "unspokenPunctuation",
    ].includes(name)) {
      record[name] = Boolean(input);
    } else if (name === "maxAlternatives") {
      record.maxAlternatives = Math.max(1, Number(input) >>> 0);
    } else if (name === "phrases") {
      const values = [...input];
      if (!values.every(item => state.get(item)?.kind === "phrase")) {
        throw new TypeError("phrases must contain SpeechRecognitionPhrase values");
      }
      record.phrases = Object.freeze(values);
    } else {
      record[name] = `${input}`;
    }
    return;
  }
  if (record.kind === "grammar") {
    if (name === "src") {
      record.src = input === "" ? "" : new URL(`${input}`, globalThis.location.href).href;
    }
    if (name === "weight") record.weight = Number(input);
  }
}

export function speechRecognitionOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "recognition") {
    if (name === "start") return startRecognition(record);
    if (name === "stop" || name === "abort") {
      finishRecognition(record);
      return undefined;
    }
  }
  if (record.kind === "grammarList") {
    if (name === "item") return record.values[toIndex(args[0])] ?? null;
    if (name === "addFromString") {
      addGrammar(value, record, `data:application/xml,${args[0]}`, args[1]);
      return undefined;
    }
    if (name === "addFromUri") {
      addGrammar(
        value,
        record,
        new URL(`${args[0]}`, globalThis.location.href).href,
        args[1],
      );
      return undefined;
    }
  }
  throw new TypeError(`Unsupported speech recognition operation: ${name}`);
}

export function speechRecognitionIterator(value) {
  const record = requireRecord(value);
  if (record.kind !== "grammarList") throw new TypeError("Illegal invocation");
  return record.values.values();
}

export function recognitionStaticOperation(name, options) {
  const languages = options?.langs;
  if (!Array.isArray(languages) || languages.length === 0) {
    throw new TypeError("A non-empty langs array is required");
  }
  if (name === "available") return Promise.resolve("available");
  return Promise.resolve(true);
}

function createSpeechGrammarList() {
  const value = Object.create(SpeechGrammarList.prototype);
  state.set(value, { kind: "grammarList", values: [] });
  return value;
}

function createGrammar(src, weight) {
  const value = Object.create(SpeechGrammar.prototype);
  state.set(value, {
    kind: "grammar",
    src,
    weight: Number(weight ?? 1),
  });
  return value;
}

function addGrammar(list, record, src, weight) {
  const grammar = createGrammar(src, weight);
  const index = record.values.length;
  record.values.push(grammar);
  Object.defineProperty(list, index, {
    value: grammar,
    enumerable: true,
    configurable: true,
  });
}

function startRecognition(record) {
  if (record.started) {
    throw new DOMException(
      "recognition has already started.",
      "InvalidStateError",
    );
  }
  record.started = true;
  Promise.resolve().then(() => {
    if (!record.started) return;
    record.started = false;
    fire(
      record,
      "error",
      new SpeechRecognitionErrorEvent("error", {
        error: "not-allowed",
        message: "Speech recognition permission was not granted",
      }),
    );
    fire(record, "end");
  });
  return undefined;
}

function finishRecognition(record) {
  if (!record.started) return;
  record.started = false;
  fire(record, "end");
}

function fire(record, type, event = new Event(type)) {
  record.object.dispatchEvent(event);
  const handler = record.handlers.get(`on${type}`);
  if (handler !== null && handler !== undefined) {
    Reflect.apply(handler, record.object, [event]);
  }
}

function toIndex(value) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.trunc(number) : 0;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}
