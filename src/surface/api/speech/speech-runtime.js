import { Event } from "../event/event-constructor.js";
import { initializeEvent } from "../event/event-state.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { monotonicNow } from "../../../infra/scheduler/monotonic-clock.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const state = new WeakMap();
let profileLanguage = "en-US";
let singleton = null;

export function SpeechSynthesis() {
  illegalConstructor(undefined, new.target);
}

export function SpeechSynthesisEvent(type, init) {
  requireNew(new.target, "SpeechSynthesisEvent");
  initializeSpeechEvent(this, type, init);
}

export function SpeechSynthesisErrorEvent(type, init) {
  requireNew(new.target, "SpeechSynthesisErrorEvent");
  initializeSpeechEvent(this, type, init);
  state.get(this).error = `${init.error ?? ""}`;
}

export function SpeechSynthesisUtterance(text = "") {
  requireNew(new.target, "SpeechSynthesisUtterance");
  initializeEventTarget(this);
  state.set(this, {
    kind: "utterance",
    text: `${text}`,
    lang: "",
    voice: null,
    volume: 1,
    rate: 1,
    pitch: 1,
    handlers: createHandlerMap([
      "onstart",
      "onend",
      "onerror",
      "onpause",
      "onresume",
      "onmark",
      "onboundary",
    ]),
    queued: false,
  });
}

export function SpeechSynthesisVoice() {
  illegalConstructor(undefined, new.target);
}

export const speechConstructors = Object.freeze([
  SpeechSynthesis,
  SpeechSynthesisErrorEvent,
  SpeechSynthesisEvent,
  SpeechSynthesisUtterance,
  SpeechSynthesisVoice,
]);

for (const constructor of speechConstructors) {
  registerNativeFunction(constructor, constructor.name);
}

export function configureSpeechProfile(language = "en-US") {
  profileLanguage = `${language}`;
}

export function createSpeechSynthesis() {
  if (singleton !== null) return singleton;
  const value = Object.create(SpeechSynthesis.prototype);
  initializeEventTarget(value);
  state.set(value, {
    kind: "synthesis",
    object: value,
    queue: [],
    current: null,
    paused: false,
    pumpScheduled: false,
    finishScheduled: false,
    generation: 0,
    voices: createFixedVoices(profileLanguage),
    handlers: createHandlerMap(["onvoiceschanged"]),
  });
  singleton = value;
  return value;
}

export function speechProperty(value, name) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) return record.handlers.get(name);
  if (record.kind === "synthesis") {
    if (name === "pending") return record.queue.length > 0;
    if (name === "speaking") return record.current !== null;
    if (name === "paused") return record.paused;
  }
  return record[name];
}

export function setSpeechProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
    return;
  }
  if (record.kind !== "utterance") return;
  if (name === "text" || name === "lang") {
    record[name] = `${input}`;
    return;
  }
  if (name === "voice") {
    if (input !== null && state.get(input)?.kind !== "voice") {
      throw new TypeError("voice must be a SpeechSynthesisVoice or null");
    }
    record.voice = input;
    return;
  }
  if (name === "volume") {
    record.volume = finiteRange(input, "volume", 0, 1);
    return;
  }
  if (name === "rate") {
    record.rate = finiteRange(input, "rate", 0.1, 10);
    return;
  }
  if (name === "pitch") {
    record.pitch = finiteRange(input, "pitch", 0, 2);
  }
}

export function speechOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind !== "synthesis") {
    throw new TypeError(`Unsupported speech operation: ${name}`);
  }
  if (name === "getVoices") return [...record.voices];
  if (name === "speak") {
    const utterance = args[0];
    const utteranceRecord = requireKind(utterance, "utterance");
    if (utteranceRecord.queued) {
      throw new DOMException(
        "The utterance is already queued.",
        "InvalidStateError",
      );
    }
    utteranceRecord.queued = true;
    record.queue.push(utterance);
    schedulePump(record);
    return;
  }
  if (name === "cancel") {
    cancelSpeech(record);
    return;
  }
  if (name === "pause") {
    if (record.paused) return;
    record.paused = true;
    if (record.current !== null) {
      emitUtterance(record.current, "pause", record.startedAt);
    }
    return;
  }
  if (name === "resume") {
    if (!record.paused) return;
    record.paused = false;
    if (record.current !== null) {
      emitUtterance(record.current, "resume", record.startedAt);
      scheduleFinish(record);
    } else {
      schedulePump(record);
    }
    return;
  }
  if (name === "preload") {
    if (args[0] !== undefined) requireKind(args[0], "utterance");
    return;
  }
  throw new TypeError(`Unsupported SpeechSynthesis operation: ${name}`);
}

function initializeSpeechEvent(value, type, init) {
  if (arguments.length < 3 || init === null || typeof init !== "object") {
    throw new TypeError("SpeechSynthesisEvent requires an init object");
  }
  const utterance = init.utterance;
  requireKind(utterance, "utterance");
  initializeEvent(value, `${type}`, {
    bubbles: Boolean(init.bubbles),
    cancelable: Boolean(init.cancelable),
    composed: Boolean(init.composed),
  });
  state.set(value, {
    kind: "speechEvent",
    utterance,
    charIndex: nonNegativeInteger(init.charIndex ?? 0, "charIndex"),
    charLength: nonNegativeInteger(init.charLength ?? 0, "charLength"),
    elapsedTime: finiteRange(
      init.elapsedTime ?? 0,
      "elapsedTime",
      0,
      Number.MAX_VALUE,
    ),
    name: `${init.name ?? ""}`,
    error: "",
  });
}

function schedulePump(record) {
  if (record.pumpScheduled || record.paused || record.current !== null) return;
  record.pumpScheduled = true;
  const generation = record.generation;
  Promise.resolve().then(() => {
    record.pumpScheduled = false;
    if (
      generation !== record.generation
      || record.paused
      || record.current !== null
    ) {
      return;
    }
    const utterance = record.queue.shift();
    if (utterance === undefined) return;
    record.current = utterance;
    record.startedAt = monotonicNow();
    emitUtterance(utterance, "start", record.startedAt);
    scheduleFinish(record);
  });
}

function scheduleFinish(record) {
  if (
    record.finishScheduled
    || record.paused
    || record.current === null
  ) {
    return;
  }
  record.finishScheduled = true;
  const generation = record.generation;
  Promise.resolve().then(() => {
    record.finishScheduled = false;
    if (
      generation !== record.generation
      || record.paused
      || record.current === null
    ) {
      return;
    }
    const utterance = record.current;
    const utteranceRecord = requireKind(utterance, "utterance");
    record.current = null;
    utteranceRecord.queued = false;
    emitUtterance(
      utterance,
      "end",
      record.startedAt,
      utteranceRecord.text.length,
    );
    schedulePump(record);
  });
}

function cancelSpeech(record) {
  record.generation += 1;
  record.pumpScheduled = false;
  record.finishScheduled = false;
  for (const utterance of record.queue.splice(0)) {
    requireKind(utterance, "utterance").queued = false;
  }
  if (record.current !== null) {
    const utterance = record.current;
    requireKind(utterance, "utterance").queued = false;
    record.current = null;
    emitUtterance(utterance, "error", record.startedAt, 0, "canceled");
  }
}

function emitUtterance(
  utterance,
  type,
  startedAt,
  charIndex = 0,
  error = "",
) {
  const record = requireKind(utterance, "utterance");
  const init = {
    utterance,
    charIndex,
    charLength: 0,
    elapsedTime: Math.max(0, (monotonicNow() - startedAt) / 1000),
    name: "",
    error,
  };
  const event = error === ""
    ? new SpeechSynthesisEvent(type, init)
    : new SpeechSynthesisErrorEvent(type, init);
  utterance.dispatchEvent(event);
  const handler = record.handlers.get(`on${type}`) ?? null;
  if (handler !== null) Reflect.apply(handler, utterance, [event]);
}

function createFixedVoices(language) {
  const preferred = language.toLowerCase().startsWith("zh")
    ? "zh-CN"
    : "en-US";
  const definitions = [
    {
      voiceURI: "Microsoft Xiaoxiao Online (Natural) - Chinese (Mainland)",
      name: "Microsoft Xiaoxiao Online (Natural) - Chinese (Mainland)",
      lang: "zh-CN",
      localService: false,
      default: preferred === "zh-CN",
    },
    {
      voiceURI: "Microsoft Aria Online (Natural) - English (United States)",
      name: "Microsoft Aria Online (Natural) - English (United States)",
      lang: "en-US",
      localService: false,
      default: preferred === "en-US",
    },
  ];
  return Object.freeze(definitions.map(definition => {
    const voice = Object.create(SpeechSynthesisVoice.prototype);
    state.set(voice, { kind: "voice", ...definition });
    return voice;
  }));
}

function createHandlerMap(names) {
  return new Map(names.map(name => [name, null]));
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireKind(value, kind) {
  const record = requireRecord(value);
  if (record.kind !== kind) throw new TypeError("Illegal invocation");
  return record;
}

function requireNew(newTarget, name) {
  if (newTarget === undefined) {
    throw new TypeError(`Failed to construct '${name}': use the new operator`);
  }
}

function illegalConstructor(name, newTarget) {
  // 真实 Chromium：`Failed to construct 'Node': Illegal constructor`
  // 不带接口名的裸文案是可检测偏差。
  throw new TypeError(
    newTarget === undefined
      ? "Illegal constructor"
      : `Failed to construct '${name}': Illegal constructor`,
  );
}

function finiteRange(value, name, minimum, maximum) {
  const number = Number(value);
  if (!Number.isFinite(number) || number < minimum || number > maximum) {
    throw new RangeError(`${name} is outside its supported range`);
  }
  return number;
}

function nonNegativeInteger(value, name) {
  const number = Number(value);
  if (!Number.isInteger(number) || number < 0) {
    throw new RangeError(`${name} must be a non-negative integer`);
  }
  return number;
}
