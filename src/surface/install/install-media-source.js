import { Event } from "../api/event/event-constructor.js";
import { EventTarget } from "../api/event/event-target-constructor.js";
import {
  BlobEvent,
  MediaRecorder,
  MediaSource,
  MediaSourceHandle,
  SourceBuffer,
  SourceBufferList,
  mediaRecorderIsTypeSupported,
  mediaSourceIsTypeSupported,
  mediaSourceOperation,
  mediaSourceProperty,
  setMediaSourceProperty,
  sourceBufferListValues,
} from "../api/media-source/media-source-runtime.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

const surfaces = new Map([
  [MediaSource, [
    ["accessor", "sourceBuffers"],
    ["accessor", "activeSourceBuffers"],
    ["accessor", "duration"],
    ["accessor", "onsourceopen"],
    ["accessor", "onsourceended"],
    ["accessor", "onsourceclose"],
    ["accessor", "readyState"],
    ["method", "addSourceBuffer", 1],
    ["method", "clearLiveSeekableRange", 0],
    ["method", "endOfStream", 0],
    ["method", "removeSourceBuffer", 1],
    ["method", "setLiveSeekableRange", 2],
    ["constructor"],
    ["tag"],
  ]],
  [MediaSourceHandle, [["constructor"], ["tag"]]],
  [SourceBuffer, [
    ["accessor", "mode"],
    ["accessor", "updating"],
    ["accessor", "buffered"],
    ["accessor", "timestampOffset"],
    ["accessor", "appendWindowStart"],
    ["accessor", "appendWindowEnd"],
    ["accessor", "onupdatestart"],
    ["accessor", "onupdate"],
    ["accessor", "onupdateend"],
    ["accessor", "onerror"],
    ["accessor", "onabort"],
    ["method", "abort", 0],
    ["method", "appendBuffer", 1],
    ["method", "changeType", 1],
    ["method", "remove", 2],
    ["constructor"],
    ["tag"],
  ]],
  [SourceBufferList, [
    ["accessor", "length"],
    ["accessor", "onaddsourcebuffer"],
    ["accessor", "onremovesourcebuffer"],
    ["constructor"],
    ["tag"],
    ["iterator"],
  ]],
  [MediaRecorder, [
    ["accessor", "stream"],
    ["accessor", "mimeType"],
    ["accessor", "state"],
    ["accessor", "onstart"],
    ["accessor", "onstop"],
    ["accessor", "ondataavailable"],
    ["accessor", "onpause"],
    ["accessor", "onresume"],
    ["accessor", "onerror"],
    ["accessor", "videoBitsPerSecond"],
    ["accessor", "audioBitsPerSecond"],
    ["accessor", "audioBitrateMode"],
    ["method", "pause", 0],
    ["method", "requestData", 0],
    ["method", "resume", 0],
    ["method", "start", 0],
    ["method", "stop", 0],
    ["constructor"],
    ["tag"],
  ]],
  [BlobEvent, [
    ["accessor", "data"],
    ["accessor", "timecode"],
    ["constructor"],
    ["tag"],
  ]],
]);

const writable = new Set([
  "duration",
  "onsourceopen",
  "onsourceended",
  "onsourceclose",
  "mode",
  "timestampOffset",
  "appendWindowStart",
  "appendWindowEnd",
  "onupdatestart",
  "onupdate",
  "onupdateend",
  "onerror",
  "onabort",
  "onaddsourcebuffer",
  "onremovesourcebuffer",
  "onstart",
  "onstop",
  "ondataavailable",
  "onpause",
  "onresume",
]);

export function installMediaSource() {
  for (const [Constructor] of surfaces) {
    delete Constructor.prototype.constructor;
    defineGlobalConstructor(Constructor.name, Constructor);
  }

  for (const Constructor of [MediaSource, SourceBuffer, SourceBufferList, MediaRecorder]) {
    Object.setPrototypeOf(Constructor.prototype, EventTarget.prototype);
    Object.setPrototypeOf(Constructor, EventTarget);
  }
  Object.setPrototypeOf(BlobEvent.prototype, Event.prototype);
  Object.setPrototypeOf(BlobEvent, Event);

  for (const [Constructor, members] of surfaces) {
    for (const [kind, name, length] of members) {
      if (kind === "accessor") accessor(Constructor, name);
      else if (kind === "method") method(Constructor, name, length);
      else if (kind === "constructor") defineConstructorBacklink(Constructor.prototype, Constructor);
      else if (kind === "tag") defineToStringTag(Constructor.prototype, Constructor.name);
      else if (kind === "iterator") installIterator(Constructor);
    }
  }

  staticMethod(MediaSource, "isTypeSupported", mediaSourceIsTypeSupported);
  staticMethod(MediaRecorder, "isTypeSupported", mediaRecorderIsTypeSupported);
}

function installIterator(Constructor) {
  function values() {
    return sourceBufferListValues(this);
  }
  registerNativeFunction(values, "values");
  definePrototypeMethod(
    Constructor.prototype,
    Symbol.iterator,
    values,
    "values",
    false,
  );
}

function accessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return mediaSourceProperty(this, name);
    },
    set [name](value) {
      setMediaSourceProperty(this, name, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  if (writable.has(name)) {
    registerNativeFunction(descriptor.set, `set ${name}`);
    definePrototypeAccessor(
      Constructor.prototype,
      name,
      descriptor.get,
      descriptor.set,
    );
  } else {
    definePrototypeGetter(Constructor.prototype, name, descriptor.get);
  }
}

function method(Constructor, name, length) {
  const callback = {
    [name](...args) {
      return mediaSourceOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}

function staticMethod(Constructor, name, operation) {
  const callback = {
    [name](value) {
      return operation(value);
    },
  }[name];
  registerNativeFunction(callback, name);
  Object.defineProperty(Constructor, name, {
    value: callback,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}
