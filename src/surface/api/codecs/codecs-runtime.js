import { Event } from "../event/event-constructor.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { createDOMRectReadOnly } from "../geometry/dom-rect-read-only-constructor.js";
import { requireImageData } from "../canvas/image-data-state.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const state = new WeakMap();
let capabilityProfile = Object.freeze({
  audioCodecs: Object.freeze(["opus", "vorbis", "mp4a", "flac", "pcm"]),
  videoCodecs: Object.freeze(["vp8", "vp09", "av01", "avc1", "hvc1", "hev1"]),
  imageTypes: Object.freeze([
    "image/png", "image/jpeg", "image/webp", "image/gif", "image/avif",
  ]),
});

export function configureCodecsProfile(profile = null) {
  capabilityProfile = Object.freeze({
    audioCodecs: Object.freeze([...(profile?.audioCodecs
      ?? capabilityProfile.audioCodecs)]),
    videoCodecs: Object.freeze([...(profile?.videoCodecs
      ?? capabilityProfile.videoCodecs)]),
    imageTypes: Object.freeze([...(profile?.imageTypes
      ?? capabilityProfile.imageTypes)].map(value => `${value}`.toLowerCase())),
  });
}

export function AudioData(init) {
  requireNew(new.target, "AudioData");
  initializeAudioData(this, init);
}

export function VideoFrame(data) {
  requireNew(new.target, "VideoFrame");
  initializeVideoFrame(this, data, arguments[1] ?? {});
}

export function EncodedAudioChunk(init) {
  requireNew(new.target, "EncodedAudioChunk");
  initializeChunk(this, "encodedAudioChunk", init);
}

export function EncodedVideoChunk(init) {
  requireNew(new.target, "EncodedVideoChunk");
  initializeChunk(this, "encodedVideoChunk", init);
}

export function AudioDecoder(init) {
  requireNew(new.target, "AudioDecoder");
  initializeCodec(this, "audioDecoder", init);
}

export function AudioEncoder(init) {
  requireNew(new.target, "AudioEncoder");
  initializeCodec(this, "audioEncoder", init);
}

export function VideoDecoder(init) {
  requireNew(new.target, "VideoDecoder");
  initializeCodec(this, "videoDecoder", init);
}

export function VideoEncoder(init) {
  requireNew(new.target, "VideoEncoder");
  initializeCodec(this, "videoEncoder", init);
}

export function VideoColorSpace() {
  requireNew(new.target, "VideoColorSpace");
  initializeColorSpace(this, arguments[0] ?? {});
}

export function ImageDecoder(init) {
  requireNew(new.target, "ImageDecoder");
  initializeImageDecoder(this, init);
}

export function ImageTrack() { illegalConstructor("ImageTrack", new.target); }
export function ImageTrackList() { illegalConstructor("ImageTrackList", new.target); }

export const codecsConstructors = Object.freeze([
  AudioData,
  VideoFrame,
  EncodedAudioChunk,
  EncodedVideoChunk,
  AudioDecoder,
  AudioEncoder,
  VideoDecoder,
  VideoEncoder,
  VideoColorSpace,
  ImageDecoder,
  ImageTrack,
  ImageTrackList,
]);

for (const constructor of codecsConstructors) {
  registerNativeFunction(constructor, constructor.name);
}

export function codecsProperty(value, name) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) return record.handlers.get(name);
  if (record.kind === "imageTrackList") {
    if (name === "length") return record.values.length;
    if (name === "selectedTrack") return record.values[record.selectedIndex] ?? null;
  }
  if (record.closed && ["format", "codedRect", "visibleRect"].includes(name)) {
    return null;
  }
  return record[name];
}

export function setCodecsProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
    return;
  }
  if (record.kind === "imageTrack" && name === "selected") {
    record.list.selectedIndex = input ? record.index : -1;
    for (const track of record.list.values) {
      requireRecord(track).selected = track === value && Boolean(input);
    }
  }
}

export function codecsOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "audioData") return audioDataOperation(value, record, name, args);
  if (record.kind === "videoFrame") return videoFrameOperation(value, record, name, args);
  if (["encodedAudioChunk", "encodedVideoChunk"].includes(record.kind)) {
    if (name === "copyTo") {
      copyBytes(record.bytes, args[0]);
      return;
    }
  }
  if ([
    "audioDecoder",
    "audioEncoder",
    "videoDecoder",
    "videoEncoder",
  ].includes(record.kind)) {
    return codecOperation(value, record, name, args);
  }
  if (record.kind === "videoColorSpace" && name === "toJSON") {
    return {
      primaries: record.primaries,
      transfer: record.transfer,
      matrix: record.matrix,
      fullRange: record.fullRange,
    };
  }
  if (record.kind === "imageDecoder") return imageDecoderOperation(record, name, args);
  throw new TypeError(`Unsupported codec operation: ${name}`);
}

export function imageTrackListValues(value) {
  return requireKind(value, "imageTrackList").values.values();
}

export function codecIsConfigSupported(kind, config) {
  if (config === null || typeof config !== "object") {
    return Promise.reject(new TypeError("Codec config must be an object"));
  }
  const codec = `${config.codec ?? ""}`;
  const supported = configuredCodecSupported(kind, codec);
  return Promise.resolve({
    supported,
    config: Object.freeze({ ...config }),
  });
}

export function imageDecoderIsTypeSupported(type) {
  return Promise.resolve(
    capabilityProfile.imageTypes.includes(`${type}`.toLowerCase()),
  );
}

function initializeAudioData(value, init) {
  requireInit(init, "AudioData");
  const format = `${init.format}`;
  const sampleRate = positiveNumber(init.sampleRate, "sampleRate");
  const numberOfFrames = positiveInteger(init.numberOfFrames, "numberOfFrames");
  const numberOfChannels = positiveInteger(init.numberOfChannels, "numberOfChannels");
  const bytes = copySource(init.data);
  state.set(value, {
    kind: "audioData",
    format,
    sampleRate,
    numberOfFrames,
    numberOfChannels,
    duration: numberOfFrames / sampleRate * 1_000_000,
    timestamp: Number(init.timestamp),
    bytes,
    closed: false,
  });
}

function initializeVideoFrame(value, data, init) {
  let bytes;
  let width;
  let height;
  let format = `${init.format ?? "RGBA"}`;
  if (state.get(data)?.kind === "videoFrame") {
    const source = requireOpen(data, "videoFrame");
    bytes = new Uint8Array(source.bytes);
    width = source.codedWidth;
    height = source.codedHeight;
    format = source.format;
    init = {
      timestamp: init.timestamp ?? source.timestamp,
      duration: init.duration ?? source.duration,
      codedWidth: width,
      codedHeight: height,
      displayWidth: init.displayWidth ?? source.displayWidth,
      displayHeight: init.displayHeight ?? source.displayHeight,
      colorSpace: init.colorSpace ?? source.colorSpace,
    };
  } else {
    const image = imageDataRecord(data);
    if (image !== null) {
      bytes = new Uint8Array(
        image.data.buffer,
        image.data.byteOffset,
        image.data.byteLength,
      ).slice();
      width = image.width;
      height = image.height;
    } else {
      bytes = copySource(data);
      width = positiveInteger(init.codedWidth, "codedWidth");
      height = positiveInteger(init.codedHeight, "codedHeight");
    }
  }
  const codedWidth = positiveInteger(init.codedWidth ?? width, "codedWidth");
  const codedHeight = positiveInteger(init.codedHeight ?? height, "codedHeight");
  const codedRect = createDOMRectReadOnly(0, 0, codedWidth, codedHeight);
  const visible = init.visibleRect ?? {
    x: 0,
    y: 0,
    width: codedWidth,
    height: codedHeight,
  };
  const colorSpace = init.colorSpace instanceof VideoColorSpace
    ? init.colorSpace
    : createColorSpace(init.colorSpace ?? {});
  state.set(value, {
    kind: "videoFrame",
    format,
    timestamp: Number(init.timestamp),
    duration: init.duration === undefined ? null : Number(init.duration),
    codedWidth,
    codedHeight,
    codedRect,
    visibleRect: createDOMRectReadOnly(
      visible.x ?? 0,
      visible.y ?? 0,
      visible.width ?? codedWidth,
      visible.height ?? codedHeight,
    ),
    rotation: Number(init.rotation ?? 0),
    flip: Boolean(init.flip),
    displayWidth: positiveInteger(init.displayWidth ?? codedWidth, "displayWidth"),
    displayHeight: positiveInteger(init.displayHeight ?? codedHeight, "displayHeight"),
    colorSpace,
    bytes,
    metadataValue: Object.freeze({}),
    closed: false,
  });
}

function initializeChunk(value, kind, init) {
  requireInit(init, kind);
  state.set(value, {
    kind,
    type: `${init.type}`,
    timestamp: Number(init.timestamp),
    duration: init.duration === undefined ? null : Number(init.duration),
    bytes: copySource(init.data),
  });
  state.get(value).byteLength = state.get(value).bytes.byteLength;
}

function initializeCodec(value, kind, init) {
  requireInit(init, kind);
  if (typeof init.output !== "function" || typeof init.error !== "function") {
    throw new TypeError("Codec init requires output and error callbacks");
  }
  initializeEventTarget(value);
  state.set(value, {
    kind,
    object: value,
    output: init.output,
    error: init.error,
    state: "unconfigured",
    config: null,
    decodeQueueSize: 0,
    encodeQueueSize: 0,
    handlers: new Map([["ondequeue", null]]),
    generation: 0,
    pending: new Set(),
  });
}

function initializeColorSpace(value, init) {
  state.set(value, {
    kind: "videoColorSpace",
    primaries: init.primaries ?? null,
    transfer: init.transfer ?? null,
    matrix: init.matrix ?? null,
    fullRange: init.fullRange ?? null,
  });
}

function initializeImageDecoder(value, init) {
  requireInit(init, "ImageDecoder");
  const bytes = copySource(init.data);
  const trackList = createImageTrackList();
  state.set(value, {
    kind: "imageDecoder",
    type: `${init.type}`,
    complete: Boolean(init.completeFramesOnly ?? true),
    completed: Promise.resolve(),
    tracks: trackList,
    bytes,
    width: positiveInteger(init.desiredWidth ?? 1, "desiredWidth"),
    height: positiveInteger(init.desiredHeight ?? 1, "desiredHeight"),
    closed: false,
  });
}

function audioDataOperation(value, record, name, args) {
  if (name === "close") {
    record.closed = true;
    record.bytes = new Uint8Array();
    return;
  }
  requireOpen(value, "audioData");
  if (name === "clone") {
    return new AudioData({
      format: record.format,
      sampleRate: record.sampleRate,
      numberOfFrames: record.numberOfFrames,
      numberOfChannels: record.numberOfChannels,
      timestamp: record.timestamp,
      data: record.bytes,
    });
  }
  if (name === "allocationSize") return audioAllocation(record, args[0]);
  if (name === "copyTo") {
    const options = args[1] ?? {};
    const size = audioAllocation(record, options);
    copyBytes(record.bytes.subarray(0, size), args[0]);
    return [{
      offset: 0,
      stride: Math.floor(size / record.numberOfFrames),
    }];
  }
  throw new TypeError(`Unsupported AudioData operation: ${name}`);
}

function videoFrameOperation(value, record, name, args) {
  if (name === "close") {
    record.closed = true;
    record.bytes = new Uint8Array();
    return;
  }
  requireOpen(value, "videoFrame");
  if (name === "clone") return new VideoFrame(value);
  if (name === "allocationSize") return record.bytes.byteLength;
  if (name === "copyTo") {
    copyBytes(record.bytes, args[0]);
    return Promise.resolve([{
      offset: 0,
      stride: record.codedWidth * 4,
    }]);
  }
  if (name === "metadata") return record.metadataValue;
  throw new TypeError(`Unsupported VideoFrame operation: ${name}`);
}

function codecOperation(codec, record, name, args) {
  if (name === "configure") {
    if (record.state === "closed") invalidState("Codec is closed");
    requireInit(args[0], "codec config");
    if (!configuredCodecSupported(record.kind, args[0].codec)) {
      throw new DOMException(
        "The requested codec is not enabled by the fingerprint.",
        "NotSupportedError",
      );
    }
    record.config = Object.freeze({ ...args[0] });
    record.state = "configured";
    return;
  }
  if (name === "close") {
    record.state = "closed";
    record.generation += 1;
    record.pending.clear();
    setQueueSize(record, 0);
    return;
  }
  if (name === "reset") {
    if (record.state === "closed") invalidState("Codec is closed");
    record.state = "unconfigured";
    record.generation += 1;
    record.pending.clear();
    setQueueSize(record, 0);
    return;
  }
  if (name === "flush") {
    if (record.state !== "configured") invalidState("Codec is not configured");
    return Promise.all([...record.pending]).then(() => undefined);
  }
  if (!["decode", "encode"].includes(name)) {
    throw new TypeError(`Unsupported codec operation: ${name}`);
  }
  if (record.state !== "configured") invalidState("Codec is not configured");
  const input = args[0];
  const generation = record.generation;
  incrementQueue(record);
  let pending;
  pending = Promise.resolve().then(() => {
    if (record.generation !== generation || record.state !== "configured") return;
    const output = name === "decode"
      ? decodeOutput(record, input)
      : encodeOutput(record, input, args[1] ?? {});
    Reflect.apply(record.output, undefined, [output, {}]);
  }).catch(error => {
    Reflect.apply(record.error, undefined, [error]);
  }).finally(() => {
    record.pending.delete(pending);
    if (record.generation === generation) {
      decrementQueue(record);
      emitDequeue(record);
    }
  });
  record.pending.add(pending);
}

function configuredCodecSupported(kind, codec) {
  const configuredCodecs = kind.startsWith("audio")
    ? capabilityProfile.audioCodecs
    : capabilityProfile.videoCodecs;
  const normalizedCodec = `${codec ?? ""}`.toLowerCase();
  return configuredCodecs.some(value => {
    const prefix = `${value}`.toLowerCase();
    return normalizedCodec === prefix
      || normalizedCodec.startsWith(`${prefix}.`)
      || normalizedCodec.startsWith(`${prefix}-`);
  });
}

function decodeOutput(record, input) {
  if (record.kind === "audioDecoder") {
    const chunk = requireKind(input, "encodedAudioChunk");
    const sampleRate = positiveNumber(record.config.sampleRate ?? 48000, "sampleRate");
    const channels = positiveInteger(record.config.numberOfChannels ?? 1, "numberOfChannels");
    const frames = Math.max(1, Math.floor(chunk.bytes.byteLength / (channels * 4)));
    return new AudioData({
      format: "f32-planar",
      sampleRate,
      numberOfFrames: frames,
      numberOfChannels: channels,
      timestamp: chunk.timestamp,
      data: new Uint8Array(frames * channels * 4),
    });
  }
  const chunk = requireKind(input, "encodedVideoChunk");
  const width = positiveInteger(record.config.codedWidth ?? 1, "codedWidth");
  const height = positiveInteger(record.config.codedHeight ?? 1, "codedHeight");
  return new VideoFrame(new Uint8Array(width * height * 4), {
    format: "RGBA",
    codedWidth: width,
    codedHeight: height,
    timestamp: chunk.timestamp,
    duration: chunk.duration,
  });
}

function encodeOutput(record, input, options) {
  if (record.kind === "audioEncoder") {
    const data = requireOpen(input, "audioData");
    return new EncodedAudioChunk({
      type: "key",
      timestamp: data.timestamp,
      duration: data.duration,
      data: data.bytes.subarray(0, Math.min(data.bytes.length, 256)),
    });
  }
  const frame = requireOpen(input, "videoFrame");
  return new EncodedVideoChunk({
    type: options.keyFrame ? "key" : "delta",
    timestamp: frame.timestamp,
    duration: frame.duration,
    data: frame.bytes.subarray(0, Math.min(frame.bytes.length, 256)),
  });
}

function imageDecoderOperation(record, name, args) {
  if (name === "close") {
    record.closed = true;
    record.bytes = new Uint8Array();
    return;
  }
  if (record.closed) invalidState("ImageDecoder is closed");
  if (name === "reset") return;
  if (name === "decode") {
    const frameIndex = Number(args[0]?.frameIndex ?? 0);
    if (frameIndex !== 0) {
      return Promise.reject(new RangeError("Only the deterministic first frame exists"));
    }
    const image = new VideoFrame(
      new Uint8Array(record.width * record.height * 4),
      {
        format: "RGBA",
        codedWidth: record.width,
        codedHeight: record.height,
        timestamp: 0,
      },
    );
    return Promise.resolve({ image, complete: true });
  }
  throw new TypeError(`Unsupported ImageDecoder operation: ${name}`);
}

function createColorSpace(init) {
  const value = Object.create(VideoColorSpace.prototype);
  initializeColorSpace(value, init);
  return value;
}

function createImageTrackList() {
  const list = Object.create(ImageTrackList.prototype);
  const record = {
    kind: "imageTrackList",
    values: [],
    selectedIndex: 0,
    ready: null,
  };
  state.set(list, record);
  const track = Object.create(ImageTrack.prototype);
  state.set(track, {
    kind: "imageTrack",
    frameCount: 1,
    animated: false,
    repetitionCount: 0,
    selected: true,
    list: record,
    index: 0,
  });
  record.values.push(track);
  record.ready = Promise.resolve();
  Object.defineProperty(list, "0", {
    value: track,
    enumerable: true,
    configurable: true,
  });
  return list;
}

function audioAllocation(record, options = {}) {
  const planeIndex = Number(options?.planeIndex ?? 0);
  if (!Number.isInteger(planeIndex) || planeIndex < 0) {
    throw new RangeError("Invalid planeIndex");
  }
  const planar = record.format.endsWith("-planar");
  if (planeIndex >= (planar ? record.numberOfChannels : 1)) {
    throw new RangeError("Invalid planeIndex");
  }
  return planar
    ? Math.floor(record.bytes.byteLength / record.numberOfChannels)
    : record.bytes.byteLength;
}

function incrementQueue(record) {
  if (record.kind.endsWith("Decoder")) record.decodeQueueSize += 1;
  else record.encodeQueueSize += 1;
}

function decrementQueue(record) {
  if (record.kind.endsWith("Decoder")) record.decodeQueueSize -= 1;
  else record.encodeQueueSize -= 1;
}

function setQueueSize(record, value) {
  if (record.kind.endsWith("Decoder")) record.decodeQueueSize = value;
  else record.encodeQueueSize = value;
}

function emitDequeue(record) {
  const event = new Event("dequeue");
  record.object.dispatchEvent(event);
  const handler = record.handlers.get("ondequeue");
  if (handler !== null) Reflect.apply(handler, record.object, [event]);
}

function copySource(value) {
  if (value instanceof ArrayBuffer) return new Uint8Array(value.slice(0));
  if (ArrayBuffer.isView(value)) {
    return new Uint8Array(
      value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength),
    );
  }
  throw new TypeError("Expected an ArrayBuffer or typed array");
}

function copyBytes(bytes, destination) {
  if (!ArrayBuffer.isView(destination) && !(destination instanceof ArrayBuffer)) {
    throw new TypeError("Destination must be an ArrayBuffer or typed array");
  }
  const target = destination instanceof ArrayBuffer
    ? new Uint8Array(destination)
    : new Uint8Array(
      destination.buffer,
      destination.byteOffset,
      destination.byteLength,
    );
  if (target.byteLength < bytes.byteLength) {
    throw new RangeError("Destination is too small");
  }
  target.set(bytes);
}

function imageDataRecord(value) {
  try {
    return requireImageData(value);
  } catch {
    return null;
  }
}

function requireOpen(value, kind) {
  const record = requireKind(value, kind);
  if (record.closed) invalidState(`${kind} is closed`);
  return record;
}

function requireKind(value, kind) {
  const record = requireRecord(value);
  if (record.kind !== kind) throw new TypeError("Illegal invocation");
  return record;
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireInit(value, name) {
  if (value === null || typeof value !== "object") {
    throw new TypeError(`${name} requires an init object`);
  }
}

function positiveInteger(value, name) {
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number <= 0) {
    throw new RangeError(`${name} must be a positive integer`);
  }
  return number;
}

function positiveNumber(value, name) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    throw new RangeError(`${name} must be positive`);
  }
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

function illegalConstructor(name, newTarget) {
  // 真实 Chromium：`Failed to construct 'Node': Illegal constructor`
  // 不带接口名的裸文案是可检测偏差。
  throw new TypeError(
    newTarget === undefined
      ? "Illegal constructor"
      : `Failed to construct '${name}': Illegal constructor`,
  );
}
