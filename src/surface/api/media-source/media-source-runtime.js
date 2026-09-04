import { Event } from "../event/event-constructor.js";
import { initializeEvent } from "../event/event-state.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { createBlob, encodeUtf8 } from "../file/blob-state.js";
import { createTimeRanges } from "../media/time-ranges-state.js";
import { isMediaStream } from "../media/media-stream-state.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const state = new WeakMap();

export function MediaSource() {
  requireNew(new.target, "MediaSource");
  initializeEventTarget(this);
  const record = {
    kind: "mediaSource",
    object: this,
    sourceBuffers: null,
    activeSourceBuffers: null,
    duration: Number.NaN,
    readyState: "closed",
    liveRange: null,
    handlers: new Map([
      ["onsourceopen", null],
      ["onsourceended", null],
      ["onsourceclose", null],
    ]),
  };
  state.set(this, record);
  record.sourceBuffers = createSourceBufferList();
  record.activeSourceBuffers = createSourceBufferList();
  Promise.resolve().then(() => {
    if (record.readyState !== "closed") return;
    record.readyState = "open";
    emit(record, "sourceopen", "onsourceopen");
  });
}

export function MediaSourceHandle() {
  throw new TypeError("Illegal constructor");
}

export function SourceBuffer() {
  throw new TypeError("Illegal constructor");
}

export function SourceBufferList() {
  throw new TypeError("Illegal constructor");
}

export function MediaRecorder(stream) {
  requireNew(new.target, "MediaRecorder");
  if (!isMediaStream(stream)) {
    throw new TypeError("MediaRecorder requires a MediaStream");
  }
  const options = arguments[1] ?? {};
  initializeEventTarget(this);
  state.set(this, {
    kind: "mediaRecorder",
    object: this,
    stream,
    mimeType: `${options.mimeType ?? ""}`,
    state: "inactive",
    videoBitsPerSecond: Number(options.videoBitsPerSecond ?? options.bitsPerSecond ?? 0),
    audioBitsPerSecond: Number(options.audioBitsPerSecond ?? options.bitsPerSecond ?? 0),
    audioBitrateMode: `${options.audioBitrateMode ?? "variable"}`,
    handlers: new Map([
      ["onstart", null],
      ["onstop", null],
      ["ondataavailable", null],
      ["onpause", null],
      ["onresume", null],
      ["onerror", null],
    ]),
    sequence: 0,
    interval: null,
  });
}

export function BlobEvent(type, init) {
  requireNew(new.target, "BlobEvent");
  if (arguments.length < 2 || init === null || typeof init !== "object") {
    throw new TypeError("BlobEvent requires an init object");
  }
  initializeEvent(this, `${type}`, {
    bubbles: Boolean(init.bubbles),
    cancelable: Boolean(init.cancelable),
    composed: Boolean(init.composed),
  });
  state.set(this, {
    kind: "blobEvent",
    data: init.data,
    timecode: Number(init.timecode ?? 0),
  });
}

for (const constructor of [
  MediaSource,
  MediaSourceHandle,
  SourceBuffer,
  SourceBufferList,
  MediaRecorder,
  BlobEvent,
]) registerNativeFunction(constructor, constructor.name);

export function mediaSourceProperty(value, name) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) return record.handlers.get(name);
  if (record.kind === "sourceBufferList" && name === "length") {
    return record.values.length;
  }
  if (record.kind === "sourceBuffer" && name === "buffered") {
    return createTimeRanges(record.ranges);
  }
  return record[name];
}

export function setMediaSourceProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
    return;
  }
  if (record.kind === "mediaSource" && name === "duration") {
    if (record.readyState !== "open") invalidState("MediaSource is not open");
    const duration = Number(input);
    if (Number.isNaN(duration) || duration < 0) {
      throw new TypeError("MediaSource duration must be non-negative");
    }
    record.duration = duration;
    return;
  }
  if (record.kind === "sourceBuffer") {
    if (record.updating) invalidState("SourceBuffer is updating");
    if (name === "mode") {
      const mode = `${input}`;
      if (!["segments", "sequence"].includes(mode)) {
        throw new TypeError("Invalid SourceBuffer mode");
      }
      record.mode = mode;
      return;
    }
    if (name === "timestampOffset") record.timestampOffset = finite(input, name);
    else if (name === "appendWindowStart") {
      const number = finite(input, name);
      if (number < 0 || number >= record.appendWindowEnd) {
        throw new TypeError("Invalid appendWindowStart");
      }
      record.appendWindowStart = number;
    } else if (name === "appendWindowEnd") {
      const number = Number(input);
      if (Number.isNaN(number) || number <= record.appendWindowStart) {
        throw new TypeError("Invalid appendWindowEnd");
      }
      record.appendWindowEnd = number;
    }
  }
}

export function mediaSourceOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "mediaSource") return sourceOperation(record, name, args);
  if (record.kind === "sourceBuffer") return bufferOperation(record, name, args);
  if (record.kind === "mediaRecorder") return recorderOperation(record, name, args);
  throw new TypeError(`Unsupported media operation: ${name}`);
}

export function sourceBufferListValues(list) {
  return requireKind(list, "sourceBufferList").values.values();
}

export function mediaSourceIsTypeSupported(type) {
  const normalized = `${type}`.trim().toLowerCase();
  return [
    "audio/webm",
    "audio/webm; codecs=\"opus\"",
    "video/webm",
    "video/webm; codecs=\"vp8\"",
    "video/webm; codecs=\"vp9\"",
    "video/mp4",
    "audio/mp4",
  ].includes(normalized);
}

export function mediaRecorderIsTypeSupported(type) {
  return mediaSourceIsTypeSupported(type)
    || ["audio/ogg", "audio/ogg; codecs=opus"].includes(`${type}`.toLowerCase());
}

function sourceOperation(record, name, args) {
  switch (name) {
    case "addSourceBuffer": {
      if (record.readyState !== "open") invalidState("MediaSource is not open");
      const mimeType = `${args[0]}`;
      if (!mediaSourceIsTypeSupported(mimeType)) {
        throw new DOMException("The MIME type is not supported.", "NotSupportedError");
      }
      const buffer = createSourceBuffer(record, mimeType);
      addToList(record.sourceBuffers, buffer);
      addToList(record.activeSourceBuffers, buffer);
      return buffer;
    }
    case "removeSourceBuffer": {
      if (record.readyState !== "open") invalidState("MediaSource is not open");
      if (!removeFromList(record.sourceBuffers, args[0])) {
        throw new DOMException("The SourceBuffer was not found.", "NotFoundError");
      }
      removeFromList(record.activeSourceBuffers, args[0]);
      requireKind(args[0], "sourceBuffer").removed = true;
      return;
    }
    case "endOfStream":
      if (record.readyState !== "open") invalidState("MediaSource is not open");
      record.readyState = "ended";
      emit(record, "sourceended", "onsourceended");
      return;
    case "setLiveSeekableRange": {
      const start = finite(args[0], "start");
      const end = finite(args[1], "end");
      if (start < 0 || end <= start) throw new TypeError("Invalid live seekable range");
      record.liveRange = [start, end];
      return;
    }
    case "clearLiveSeekableRange":
      record.liveRange = null;
      return;
    default:
      throw new TypeError(`Unsupported MediaSource operation: ${name}`);
  }
}

function bufferOperation(record, name, args) {
  if (record.removed) invalidState("SourceBuffer was removed");
  switch (name) {
    case "appendBuffer": {
      if (record.updating) invalidState("SourceBuffer is updating");
      const bytes = sourceBytes(args[0]);
      beginUpdate(record);
      Promise.resolve().then(() => {
        const duration = Math.max(0.001, bytes.byteLength / 1024);
        const start = record.mode === "sequence"
          ? (record.ranges.at(-1)?.[1] ?? record.timestampOffset)
          : record.timestampOffset;
        const end = Math.min(record.appendWindowEnd, start + duration);
        if (end > record.appendWindowStart) {
          record.ranges.push([
            Math.max(start, record.appendWindowStart),
            end,
          ]);
          mergeRanges(record.ranges);
          const source = record.source;
          if (Number.isNaN(source.duration) || end > source.duration) {
            source.duration = end;
          }
        }
        endUpdate(record);
      });
      return;
    }
    case "remove": {
      if (record.updating) invalidState("SourceBuffer is updating");
      const start = finite(args[0], "start");
      const end = finite(args[1], "end");
      if (start < 0 || end <= start) throw new TypeError("Invalid remove range");
      beginUpdate(record);
      Promise.resolve().then(() => {
        record.ranges = subtractRange(record.ranges, start, end);
        endUpdate(record);
      });
      return;
    }
    case "abort":
      record.updating = false;
      emit(record, "abort", "onabort");
      emit(record, "updateend", "onupdateend");
      return;
    case "changeType": {
      const mimeType = `${args[0]}`;
      if (!mediaSourceIsTypeSupported(mimeType)) {
        throw new DOMException("The MIME type is not supported.", "NotSupportedError");
      }
      record.mimeType = mimeType;
      return;
    }
    default:
      throw new TypeError(`Unsupported SourceBuffer operation: ${name}`);
  }
}

function recorderOperation(record, name, args) {
  switch (name) {
    case "start": {
      if (record.state !== "inactive") invalidState("MediaRecorder is not inactive");
      record.state = "recording";
      emit(record, "start", "onstart");
      const timeslice = Number(args[0] ?? 0);
      if (Number.isFinite(timeslice) && timeslice > 0) {
        record.interval = setInterval(() => {
          if (record.state === "recording") emitRecorderData(record);
        }, Math.max(1, timeslice));
      }
      return;
    }
    case "stop":
      if (record.state === "inactive") invalidState("MediaRecorder is inactive");
      if (record.interval !== null) clearInterval(record.interval);
      record.interval = null;
      record.state = "inactive";
      emitRecorderData(record);
      emit(record, "stop", "onstop");
      return;
    case "pause":
      if (record.state !== "recording") invalidState("MediaRecorder is not recording");
      record.state = "paused";
      emit(record, "pause", "onpause");
      return;
    case "resume":
      if (record.state !== "paused") invalidState("MediaRecorder is not paused");
      record.state = "recording";
      emit(record, "resume", "onresume");
      return;
    case "requestData":
      if (record.state === "inactive") invalidState("MediaRecorder is inactive");
      emitRecorderData(record);
      return;
    default:
      throw new TypeError(`Unsupported MediaRecorder operation: ${name}`);
  }
}

function createSourceBuffer(source, mimeType) {
  const buffer = Object.create(SourceBuffer.prototype);
  initializeEventTarget(buffer);
  state.set(buffer, {
    kind: "sourceBuffer",
    object: buffer,
    source,
    mimeType,
    mode: "segments",
    updating: false,
    ranges: [],
    timestampOffset: 0,
    appendWindowStart: 0,
    appendWindowEnd: Infinity,
    removed: false,
    handlers: new Map([
      ["onupdatestart", null],
      ["onupdate", null],
      ["onupdateend", null],
      ["onerror", null],
      ["onabort", null],
    ]),
  });
  return buffer;
}

function createSourceBufferList() {
  const list = Object.create(SourceBufferList.prototype);
  initializeEventTarget(list);
  state.set(list, {
    kind: "sourceBufferList",
    object: list,
    values: [],
    handlers: new Map([
      ["onaddsourcebuffer", null],
      ["onremovesourcebuffer", null],
    ]),
  });
  return list;
}

function addToList(list, buffer) {
  const record = requireKind(list, "sourceBufferList");
  record.values.push(buffer);
  synchronizeIndexes(list, record.values);
  emit(record, "addsourcebuffer", "onaddsourcebuffer");
}

function removeFromList(list, buffer) {
  const record = requireKind(list, "sourceBufferList");
  const index = record.values.indexOf(buffer);
  if (index < 0) return false;
  record.values.splice(index, 1);
  synchronizeIndexes(list, record.values);
  emit(record, "removesourcebuffer", "onremovesourcebuffer");
  return true;
}

function synchronizeIndexes(list, values) {
  let index = 0;
  while (Object.prototype.hasOwnProperty.call(list, `${index}`)) {
    delete list[index];
    index += 1;
  }
  for (index = 0; index < values.length; index += 1) {
    Object.defineProperty(list, `${index}`, {
      value: values[index],
      enumerable: true,
      configurable: true,
    });
  }
}

function beginUpdate(record) {
  record.updating = true;
  emit(record, "updatestart", "onupdatestart");
}

function endUpdate(record) {
  record.updating = false;
  emit(record, "update", "onupdate");
  emit(record, "updateend", "onupdateend");
}

function emitRecorderData(record) {
  record.sequence += 1;
  const blob = createBlob(
    encodeUtf8(`EDGE-MEDIA-RECORDER:${record.sequence}`),
    record.mimeType,
  );
  const event = new BlobEvent("dataavailable", {
    data: blob,
    timecode: record.sequence,
  });
  Promise.resolve().then(() => {
    record.object.dispatchEvent(event);
    const handler = record.handlers.get("ondataavailable");
    if (handler !== null) Reflect.apply(handler, record.object, [event]);
  });
}

function emit(record, type, handlerName) {
  Promise.resolve().then(() => {
    const event = new Event(type);
    record.object.dispatchEvent(event);
    const handler = record.handlers?.get(handlerName) ?? null;
    if (handler !== null) Reflect.apply(handler, record.object, [event]);
  });
}

function mergeRanges(ranges) {
  ranges.sort((left, right) => left[0] - right[0]);
  for (let index = 1; index < ranges.length;) {
    const previous = ranges[index - 1];
    const current = ranges[index];
    if (current[0] <= previous[1]) {
      previous[1] = Math.max(previous[1], current[1]);
      ranges.splice(index, 1);
    } else index += 1;
  }
}

function subtractRange(ranges, start, end) {
  const output = [];
  for (const [left, right] of ranges) {
    if (right <= start || left >= end) output.push([left, right]);
    else {
      if (left < start) output.push([left, start]);
      if (right > end) output.push([end, right]);
    }
  }
  return output;
}

function sourceBytes(value) {
  if (value instanceof ArrayBuffer) return new Uint8Array(value);
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
  }
  throw new TypeError("appendBuffer requires an ArrayBuffer or view");
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

function finite(value, name) {
  const number = Number(value);
  if (!Number.isFinite(number)) throw new TypeError(`${name} must be finite`);
  return number;
}

function invalidState(message) {
  throw new DOMException(message, "InvalidStateError");
}

function requireNew(newTarget, name) {
  if (newTarget === undefined) {
    throw new TypeError(
      `Failed to construct '${name}': Please use the 'new' operator, this DOM object constructor cannot be called as a function.`,
    );
  }
}
