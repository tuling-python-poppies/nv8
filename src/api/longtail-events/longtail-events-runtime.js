import { initializeEvent } from "../event/event-state.js";
import { registerNativeFunction } from "../../webidl/native-function.js";

/**
 * 真实 Edge 151 里**不可构造**的事件接口。
 *
 * 实测方式：headless Edge 对 25 个 longtail 事件构造器逐个 `new`，
 * 8 个抛 `TypeError: Illegal constructor`，其余 17 个正常构造。
 * 不是靠规范推断——WebIDL 里有没有 `[Constructor]` 与浏览器实际实现常有出入。
 */
const NON_CONSTRUCTIBLE_EVENTS = new Set([
  "PictureInPictureEvent",
  "BeforeUnloadEvent",
  "AudioProcessingEvent",
  "ClipboardChangeEvent",
  "PresentationConnectionAvailableEvent",
  "PresentationConnectionCloseEvent",
  "DocumentPictureInPictureEvent",
  "SnapEvent",
]);

/** 不设防的构造器，仅供内部使用（页面脚本拿不到）。 */
const INTERNAL_CONSTRUCTORS = new Map();

/**
 * 内部创建一个对页面脚本不可构造的事件实例。
 *
 * @param {string} name 接口名，如 `BeforeUnloadEvent`
 * @param {string} type 事件类型
 * @param {object} [init]
 * @returns {object|null} 该接口不存在时返回 null
 */
export function constructInternalEvent(name, type, init = {}) {
  const Constructor = INTERNAL_CONSTRUCTORS.get(name);
  if (Constructor === undefined) return null;
  return new Constructor(type, init);
}

const state = new WeakMap();
const eventDefinitions = Object.freeze({
  TextUpdateEvent: {
    length: 1,
    defaults: {
      updateRangeStart: 0,
      updateRangeEnd: 0,
      text: "",
      selectionStart: 0,
      selectionEnd: 0,
    },
  },
  TextFormatUpdateEvent: {
    length: 1,
    defaults: { textFormats: Object.freeze([]) },
  },
  SecurityPolicyViolationEvent: {
    length: 1,
    defaults: {
      documentURI: "",
      referrer: "",
      blockedURI: "",
      violatedDirective: "",
      effectiveDirective: "",
      originalPolicy: "",
      disposition: "enforce",
      sourceFile: "",
      statusCode: 0,
      lineNumber: 0,
      columnNumber: 0,
      sample: "",
    },
  },
  PictureInPictureEvent: {
    length: 2,
    defaults: { pictureInPictureWindow: null },
  },
  InterestEvent: { length: 1, defaults: { source: null } },
  IDBVersionChangeEvent: {
    length: 1,
    defaults: {
      oldVersion: 0,
      newVersion: null,
      dataLoss: "none",
      dataLossMessage: "",
    },
  },
  FontFaceSetLoadEvent: {
    length: 1,
    defaults: { fontfaces: Object.freeze([]) },
  },
  ContentVisibilityAutoStateChangeEvent: {
    length: 1,
    defaults: { skipped: false },
  },
  CommandEvent: {
    length: 1,
    defaults: { source: null, command: "" },
  },
  CharacterBoundsUpdateEvent: {
    length: 1,
    defaults: { rangeStart: 0, rangeEnd: 0 },
  },
  BeforeUnloadEvent: {
    length: 0,
    defaultType: "beforeunload",
    defaults: { returnValue: "" },
  },
  BeforeInstallPromptEvent: {
    length: 1,
    defaults: { platforms: Object.freeze([]) },
  },
  AudioProcessingEvent: {
    length: 2,
    defaults: { playbackTime: 0, inputBuffer: null, outputBuffer: null },
  },
  AnimationPlaybackEvent: {
    length: 1,
    defaults: { currentTime: null, timelineTime: null },
  },
  ClipboardChangeEvent: {
    length: 0,
    defaultType: "clipboardchange",
    defaults: { types: Object.freeze([]), changeId: "" },
  },
  MIDIConnectionEvent: { length: 1, defaults: { port: null } },
  MIDIMessageEvent: { length: 1, defaults: { data: null } },
  PresentationConnectionAvailableEvent: {
    length: 2,
    defaults: { connection: null },
  },
  PresentationConnectionCloseEvent: {
    length: 2,
    defaults: { reason: "closed", message: "" },
  },
  DocumentPictureInPictureEvent: {
    length: 2,
    defaults: { window: null },
  },
  PageRevealEvent: { length: 1, defaults: { viewTransition: null } },
  PageSwapEvent: {
    length: 1,
    defaults: { viewTransition: null, activation: null },
  },
  SnapEvent: {
    length: 0,
    defaultType: "scrollsnapchange",
    defaults: { snapTargetBlock: null, snapTargetInline: null },
  },
  SpeechRecognitionErrorEvent: {
    length: 1,
    defaults: { error: "no-speech", message: "" },
  },
  SpeechRecognitionEvent: {
    length: 1,
    defaults: { resultIndex: 0, results: Object.freeze([]) },
  },
});

function createEventConstructor(name, length) {
  let Constructor;
  if (length === 0) {
    Constructor = {
      [name]: function () {
        initializeLongtailEvent(this, new.target, name, arguments);
      },
    }[name];
  } else if (length === 1) {
    Constructor = {
      [name]: function (type) {
        initializeLongtailEvent(this, new.target, name, arguments);
      },
    }[name];
  } else {
    Constructor = {
      [name]: function (type, init) {
        initializeLongtailEvent(this, new.target, name, arguments);
      },
    }[name];
  }
  if (NON_CONSTRUCTIBLE_EVENTS.has(name)) {
    // 这些接口在真实 Edge 里**不可构造**，`new X()` 抛
    // `TypeError: Illegal constructor`。可构造是可检测的偏差：
    // 指纹脚本会拿 `new SomeEvent()` 是否抛错来判断环境真实性。
    //
    // 内部仍需造出实例（比如导航时要派发 beforeunload），因此把不设防的
    // 构造器留在 INTERNAL_CONSTRUCTORS 里，只对页面脚本封锁。
    INTERNAL_CONSTRUCTORS.set(name, Constructor);
    const guardedLength = Constructor.length;
    Constructor = {
      [name]: function () {
        throw new TypeError(`Failed to construct '${name}': Illegal constructor`);
      },
    }[name];
    // 守卫函数必须保留原 length。真实 Edge 里这些构造器虽然不可构造，
    // `X.length` 仍是声明的参数个数（实测均为 2）；写成 0 是可检测偏差。
    Object.defineProperty(Constructor, "length", {
      value: guardedLength,
      configurable: true,
    });
  }
  registerNativeFunction(Constructor, name);
  return Constructor;
}

export const TextUpdateEvent = create("TextUpdateEvent");
export const TextFormatUpdateEvent = create("TextFormatUpdateEvent");
export const SecurityPolicyViolationEvent = create(
  "SecurityPolicyViolationEvent",
);
export const PictureInPictureEvent = create("PictureInPictureEvent");
export const InterestEvent = create("InterestEvent");
export const IDBVersionChangeEvent = create("IDBVersionChangeEvent");
export const FontFaceSetLoadEvent = create("FontFaceSetLoadEvent");
export const ContentVisibilityAutoStateChangeEvent = create(
  "ContentVisibilityAutoStateChangeEvent",
);
export const CommandEvent = create("CommandEvent");
export const CharacterBoundsUpdateEvent = create(
  "CharacterBoundsUpdateEvent",
);
export const BeforeUnloadEvent = create("BeforeUnloadEvent");
export const BeforeInstallPromptEvent = create("BeforeInstallPromptEvent");
export const AudioProcessingEvent = create("AudioProcessingEvent");
export const AnimationPlaybackEvent = create("AnimationPlaybackEvent");
export const ClipboardChangeEvent = create("ClipboardChangeEvent");
export const MIDIConnectionEvent = create("MIDIConnectionEvent");
export const MIDIMessageEvent = create("MIDIMessageEvent");
export const PresentationConnectionAvailableEvent = create(
  "PresentationConnectionAvailableEvent",
);
export const PresentationConnectionCloseEvent = create(
  "PresentationConnectionCloseEvent",
);
export const DocumentPictureInPictureEvent = create(
  "DocumentPictureInPictureEvent",
);
export const PageRevealEvent = create("PageRevealEvent");
export const PageSwapEvent = create("PageSwapEvent");
export const SnapEvent = create("SnapEvent");
export const SpeechRecognitionErrorEvent = create(
  "SpeechRecognitionErrorEvent",
);
export const SpeechRecognitionEvent = create("SpeechRecognitionEvent");
export const webkitSpeechRecognitionError = SpeechRecognitionErrorEvent;
export const webkitSpeechRecognitionEvent = SpeechRecognitionEvent;

export const longtailEventConstructors = Object.freeze([
  TextUpdateEvent,
  TextFormatUpdateEvent,
  SecurityPolicyViolationEvent,
  PictureInPictureEvent,
  InterestEvent,
  IDBVersionChangeEvent,
  FontFaceSetLoadEvent,
  ContentVisibilityAutoStateChangeEvent,
  CommandEvent,
  CharacterBoundsUpdateEvent,
  BeforeUnloadEvent,
  BeforeInstallPromptEvent,
  AudioProcessingEvent,
  AnimationPlaybackEvent,
  ClipboardChangeEvent,
  MIDIConnectionEvent,
  MIDIMessageEvent,
  PresentationConnectionAvailableEvent,
  PresentationConnectionCloseEvent,
  DocumentPictureInPictureEvent,
  PageRevealEvent,
  PageSwapEvent,
  SnapEvent,
  SpeechRecognitionErrorEvent,
  SpeechRecognitionEvent,
]);

export function longtailEventProperty(value, name) {
  const record = requireRecord(value);
  if (record.name === "BeforeInstallPromptEvent" && name === "userChoice") {
    return record.userChoice;
  }
  return record.values[name];
}

export function setLongtailEventProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.name === "BeforeUnloadEvent" && name === "returnValue") {
    record.values.returnValue = `${input}`;
  }
}

export function longtailEventOperation(value, name) {
  const record = requireRecord(value);
  if (record.name === "TextFormatUpdateEvent" && name === "getTextFormats") {
    return record.values.textFormats;
  }
  if (record.name === "BeforeInstallPromptEvent" && name === "prompt") {
    return Promise.resolve();
  }
  throw new TypeError(`Unsupported long-tail event operation: ${name}`);
}

function create(name) {
  return createEventConstructor(name, eventDefinitions[name].length);
}

function initializeLongtailEvent(value, newTarget, name, args) {
  if (newTarget === undefined) {
    throw new TypeError(`${name} requires new`);
  }
  const definition = eventDefinitions[name];
  const type = args.length === 0
    ? definition.defaultType
    : `${args[0]}`;
  if (type === undefined) throw new TypeError("Event type is required");
  const init = args[1] ?? {};
  initializeEvent(value, type, {
    bubbles: Boolean(init.bubbles),
    cancelable: Boolean(init.cancelable),
    composed: Boolean(init.composed),
  });
  const values = {};
  for (const [key, fallback] of Object.entries(definition.defaults)) {
    values[key] = normalizeValue(key, init[key], fallback);
  }
  const record = { name, values };
  if (name === "BeforeInstallPromptEvent") {
    record.userChoice = Promise.resolve(Object.freeze({
      outcome: "dismissed",
      platform: "",
    }));
  }
  state.set(value, record);
}

function normalizeValue(key, input, fallback) {
  if (input === undefined) return fallback;
  if ([
    "updateRangeStart",
    "updateRangeEnd",
    "selectionStart",
    "selectionEnd",
    "statusCode",
    "lineNumber",
    "columnNumber",
    "oldVersion",
    "rangeStart",
    "rangeEnd",
    "playbackTime",
    "resultIndex",
  ].includes(key)) return Number(input);
  if (["skipped", "visible"].includes(key)) return Boolean(input);
  if ([
    "fontfaces",
    "platforms",
    "types",
    "results",
    "textFormats",
  ].includes(key)) return Object.freeze([...input]);
  if (typeof fallback === "string") return `${input}`;
  return input;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}
