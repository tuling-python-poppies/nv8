import { initializeEvent } from "../event/event-state.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { Event } from "../event/event-constructor.js";
import { createImageBitmap } from "../canvas/image-bitmap-state.js";
import { MediaStreamTrack } from "../media/media-stream-track-constructor.js";
import {
  createMediaStreamTrack,
  initializeMediaStreamTrack,
  isMediaStreamTrack,
  requireMediaStreamTrack,
} from "../media/media-stream-track-state.js";
import { MediaStream } from "../media/media-stream-constructor.js";
import {
  ReadableStream,
  WritableStream,
} from "../streams/stream-runtime.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import {
  createChapterInformation,
} from "../chapter-information/chapter-information-runtime.js";
import { createRealmSlot } from "../../../engine/core/state-scope.js";

const state = new WeakMap();

// 媒体设备、能力、会话单例和 session 序号原先是模块级状态，会跨 Realm
// 共享设备配置与 MediaKeySession 标识。
const mediaAgencySlot = createRealmSlot(() => ({
  nextSessionId: 0,
  mediaDevicesSingleton: null,
  mediaCapabilitiesSingleton: null,
  mediaSessionSingleton: null,
}), "media-agency-runtime");

function mediaAgencyState() {
  return mediaAgencySlot.get(globalThis);
}

export function MediaDeviceInfo() { illegalConstructor("MediaDeviceInfo"); }
export function InputDeviceInfo() { illegalConstructor("InputDeviceInfo"); }
export function MediaDevices() { illegalConstructor("MediaDevices"); }
export function MediaCapabilities() { illegalConstructor("MediaCapabilities"); }
export function MediaEncryptedEvent(type) {
  requireNew(new.target, "MediaEncryptedEvent");
  const init = arguments[1] ?? {};
  initializeEvent(this, `${type}`, eventInit(init));
  state.set(this, {
    kind: "encryptedEvent",
    initDataType: `${init.initDataType ?? ""}`,
    initData: copyBuffer(init.initData),
  });
}
export function MediaKeyMessageEvent(type, init) {
  requireNew(new.target, "MediaKeyMessageEvent");
  if (init === null || typeof init !== "object") {
    throw new TypeError("MediaKeyMessageEvent init is required");
  }
  initializeEvent(this, `${type}`, eventInit(init));
  state.set(this, {
    kind: "keyMessageEvent",
    messageType: `${init.messageType ?? "license-request"}`,
    message: copyBuffer(init.message),
  });
}
export function MediaKeySession() { illegalConstructor("MediaKeySession"); }
export function MediaKeyStatusMap() { illegalConstructor("MediaKeyStatusMap"); }
export function MediaKeySystemAccess() { illegalConstructor("MediaKeySystemAccess"); }
export function MediaKeys() { illegalConstructor("MediaKeys"); }
export function MediaMetadata() {
  requireNew(new.target, "MediaMetadata");
  const init = arguments[0] ?? {};
  if (init === null || typeof init !== "object") {
    throw new TypeError("MediaMetadata init must be an object");
  }
  state.set(this, {
    kind: "metadata",
    title: `${init.title ?? ""}`,
    artist: `${init.artist ?? ""}`,
    album: `${init.album ?? ""}`,
    artwork: normalizeArtwork(init.artwork),
    chapters: normalizeChapters(init.chapterInfo),
  });
}
export function MediaSession() { illegalConstructor("MediaSession"); }
export function CaptureController() {
  requireNew(new.target, "CaptureController");
  initializeEventTarget(this);
  state.set(this, {
    kind: "captureController",
    zoomLevel: 100,
    handlers: handlers(["onzoomlevelchange"]),
    focusBehavior: "focus-captured-surface",
  });
}
export function ImageCapture(track) {
  requireNew(new.target, "ImageCapture");
  if (!isMediaStreamTrack(track) || requireMediaStreamTrack(track).kind !== "video") {
    throw new TypeError("ImageCapture requires a video MediaStreamTrack");
  }
  state.set(this, { kind: "imageCapture", track });
}
export function BrowserCaptureMediaStreamTrack() { illegalConstructor("BrowserCaptureMediaStreamTrack"); }
export function MediaStreamTrackGenerator(init) {
  requireNew(new.target, "MediaStreamTrackGenerator");
  const kind = typeof init === "string" ? init : init?.kind;
  initializeMediaStreamTrack(this, kind, "MediaStreamTrackGenerator");
  const trackRecord = requireMediaStreamTrack(this);
  const stats = createVideoStats();
  const statsRecord = requireRecord(stats);
  const writable = new WritableStream({
    write() {
      statsRecord.totalFrames += 1;
      statsRecord.deliveredFrames += 1;
    },
  });
  trackRecord.stats = stats;
  state.set(this, {
    kind: "trackGenerator",
    writable,
    totalFrames: 0,
    stats,
  });
}
export function MediaStreamTrackProcessor(init) {
  requireNew(new.target, "MediaStreamTrackProcessor");
  const track = init?.track;
  if (!isMediaStreamTrack(track)) {
    throw new TypeError("MediaStreamTrackProcessor requires a track");
  }
  state.set(this, {
    kind: "trackProcessor",
    track,
    readable: new ReadableStream(),
    totalFrames: 0,
    discardedFrames: 0,
  });
}
export function MediaStreamTrackVideoStats() { illegalConstructor("MediaStreamTrackVideoStats"); }
export function MediaStreamTrackEvent(type, init) {
  requireNew(new.target, "MediaStreamTrackEvent");
  if (init === null || typeof init !== "object" || !isMediaStreamTrack(init.track)) {
    throw new TypeError("MediaStreamTrackEvent requires a track");
  }
  initializeEvent(this, `${type}`, eventInit(init));
  state.set(this, { kind: "trackEvent", track: init.track });
}
export function MediaStreamEvent(type) {
  requireNew(new.target, "MediaStreamEvent");
  const init = arguments[1] ?? {};
  initializeEvent(this, `${type}`, eventInit(init));
  state.set(this, { kind: "streamEvent", stream: init.stream ?? null });
}

export const mediaAgencyConstructors = Object.freeze([
  MediaDeviceInfo,
  InputDeviceInfo,
  MediaDevices,
  MediaCapabilities,
  MediaEncryptedEvent,
  MediaKeyMessageEvent,
  MediaKeySession,
  MediaKeyStatusMap,
  MediaKeySystemAccess,
  MediaKeys,
  MediaMetadata,
  MediaSession,
  CaptureController,
  ImageCapture,
  BrowserCaptureMediaStreamTrack,
  MediaStreamTrackGenerator,
  MediaStreamTrackProcessor,
  MediaStreamTrackVideoStats,
  MediaStreamTrackEvent,
  MediaStreamEvent,
]);
for (const Constructor of mediaAgencyConstructors) {
  registerNativeFunction(Constructor, Constructor.name);
}

export function createMediaDevices(profile = null) {
  if (mediaAgencyState().mediaDevicesSingleton !== null) return mediaAgencyState().mediaDevicesSingleton;
  const value = Object.create(MediaDevices.prototype);
  initializeEventTarget(value);
  state.set(value, {
    kind: "mediaDevices",
    object: value,
    handlers: handlers(["ondevicechange"]),
    captureHandleConfig: null,
    profile: copyMediaProfile(profile),
    devices: Object.freeze(
      (profile?.devices ?? []).map(createMediaDeviceInfo),
    ),
  });
  mediaAgencyState().mediaDevicesSingleton = value;
  return value;
}

export function createMediaCapabilities(profile = null) {
  if (mediaAgencyState().mediaCapabilitiesSingleton !== null) return mediaAgencyState().mediaCapabilitiesSingleton;
  const value = Object.create(MediaCapabilities.prototype);
  state.set(value, {
    kind: "mediaCapabilities",
    profile: copyMediaProfile(profile),
  });
  mediaAgencyState().mediaCapabilitiesSingleton = value;
  return value;
}

export function createMediaSession() {
  if (mediaAgencyState().mediaSessionSingleton !== null) return mediaAgencyState().mediaSessionSingleton;
  const value = Object.create(MediaSession.prototype);
  state.set(value, {
    kind: "mediaSession",
    metadata: null,
    playbackState: "none",
    actionHandlers: new Map(),
    positionState: null,
    cameraActive: false,
    microphoneActive: false,
  });
  mediaAgencyState().mediaSessionSingleton = value;
  return value;
}

export function requestMediaKeySystemAccess(keySystem, configurations) {
  const normalized = `${keySystem}`;
  const values = [...configurations];
  if (normalized !== "org.w3.clearkey" || values.length === 0) {
    return Promise.reject(new DOMException(
      "The requested key system is unavailable.",
      "NotSupportedError",
    ));
  }
  const access = Object.create(MediaKeySystemAccess.prototype);
  const configuration = freezeConfiguration(values[0]);
  state.set(access, {
    kind: "keySystemAccess",
    keySystem: normalized,
    configuration,
  });
  return Promise.resolve(access);
}

export function mediaAgencyProperty(value, name) {
  const record = requireRecord(value);
  if (record.kind === "metadata" && name === "chapterInfo") {
    return record.chapters.map(createChapterInformation);
  }
  if (record.handlers?.has(name)) return record.handlers.get(name);
  if (record.kind === "keyStatusMap" && name === "size") {
    return record.values.size;
  }
  return record[name];
}

export function setMediaAgencyProperty(value, name, input) {
  const record = requireRecord(value);
  if (record.handlers?.has(name)) {
    record.handlers.set(name, typeof input === "function" ? input : null);
    return;
  }
  if (record.kind === "metadata" && [
    "title", "artist", "album",
  ].includes(name)) {
    record[name] = `${input}`;
    return;
  }
  if (record.kind === "metadata" && name === "artwork") {
    record.artwork = Object.freeze([...(input ?? [])]);
    return;
  }
  if (record.kind === "mediaSession" && name === "metadata") {
    if (input !== null && state.get(input)?.kind !== "metadata") {
      throw new TypeError("metadata must be a MediaMetadata value or null");
    }
    record.metadata = input;
    return;
  }
  if (record.kind === "mediaSession" && name === "playbackState") {
    const normalized = `${input}`;
    if (!["none", "paused", "playing"].includes(normalized)) {
      throw new TypeError("Invalid media playback state");
    }
    record.playbackState = normalized;
  }
}

export function mediaAgencyOperation(value, name, args) {
  const record = requireRecord(value);
  if (record.kind === "mediaDevices") {
    return mediaDevicesOperation(record, name, args);
  }
  if (record.kind === "mediaCapabilities") {
    return mediaCapabilitiesOperation(record, name, args[0]);
  }
  if (record.kind === "deviceInfo") {
    if (name === "toJSON") return deviceInfoJSON(record);
    if (name === "getCapabilities") return Object.freeze({ ...record.capabilities });
  }
  if (record.kind === "keySystemAccess") {
    if (name === "getConfiguration") return record.configuration;
    if (name === "createMediaKeys") return Promise.resolve(createMediaKeys(record));
  }
  if (record.kind === "mediaKeys") {
    if (name === "createSession") return createMediaKeySession(record, args[0]);
    if (name === "setServerCertificate") {
      record.serverCertificate = copyBuffer(args[0]);
      return Promise.resolve(record.serverCertificate.byteLength > 0);
    }
    if (name === "getStatusForPolicy") return Promise.resolve("usable");
  }
  if (record.kind === "keySession") {
    return keySessionOperation(record, name, args);
  }
  if (record.kind === "keyStatusMap") {
    return keyStatusMapOperation(record, value, name, args);
  }
  if (record.kind === "mediaSession") {
    return mediaSessionOperation(record, name, args);
  }
  if (record.kind === "captureController") {
    return captureControllerOperation(record, name, args);
  }
  if (record.kind === "imageCapture") {
    return imageCaptureOperation(record, name);
  }
  if (record.kind === "browserCaptureTrack") {
    if (name === "cropTo" || name === "restrictTo") {
      return Promise.reject(new DOMException(
        "Captured-surface restriction is unavailable.",
        "NotSupportedError",
      ));
    }
  }
  if (record.kind === "videoStats" && name === "toJSON") {
    return {
      deliveredFrames: record.deliveredFrames,
      discardedFrames: record.discardedFrames,
      totalFrames: record.totalFrames,
    };
  }
  throw new TypeError(`Unsupported media-agency operation: ${name}`);
}

export function mediaAgencyIterator(value) {
  const record = requireRecord(value);
  if (record.kind !== "keyStatusMap") throw new TypeError("Illegal invocation");
  return record.values.entries();
}

function mediaDevicesOperation(record, name, args) {
  if (name === "enumerateDevices") {
    return Promise.resolve(Object.freeze([...record.devices]));
  }
  if (name === "getSupportedConstraints") {
    return Object.freeze({
      width: true,
      height: true,
      aspectRatio: true,
      frameRate: true,
      facingMode: true,
      resizeMode: true,
      sampleRate: true,
      sampleSize: true,
      echoCancellation: true,
      autoGainControl: true,
      noiseSuppression: true,
      latency: true,
      channelCount: true,
      deviceId: true,
      groupId: true,
    });
  }
  if (name === "setCaptureHandleConfig") {
    record.captureHandleConfig = Object.freeze({ ...(args[0] ?? {}) });
    return;
  }
  if (name === "getUserMedia" || name === "getDisplayMedia") {
    if (name === "getUserMedia" && record.profile.captureEnabled) {
      return createSyntheticCapture(record, args[0]);
    }
    return Promise.reject(new DOMException(
      "No media capture device is available in the sandbox.",
      "NotFoundError",
    ));
  }
}

function mediaCapabilitiesOperation(record, name, configuration) {
  if (configuration === null || typeof configuration !== "object") {
    return Promise.reject(new TypeError("A media configuration is required"));
  }
  const supported = configurationSupported(record.profile, configuration);
  return Promise.resolve(Object.freeze({
    supported,
    smooth: supported,
    powerEfficient: supported && record.profile.powerEfficient,
    configuration: freezeConfiguration(configuration),
    keySystemAccess: null,
  }));
}

function createMediaDeviceInfo(input) {
  const Constructor = input.kind === "audiooutput"
    ? MediaDeviceInfo
    : InputDeviceInfo;
  const value = Object.create(Constructor.prototype);
  state.set(value, {
    kind: "deviceInfo",
    deviceId: `${input.deviceId}`,
    deviceKind: `${input.kind}`,
    label: `${input.label}`,
    groupId: `${input.groupId}`,
    capabilities: Object.freeze({ ...(input.capabilities ?? {}) }),
  });
  return value;
}

function createSyntheticCapture(record, constraints) {
  const input = constraints ?? {};
  const tracks = [];
  if (input.audio) {
    const device = record.devices.find(value =>
      requireRecord(value).deviceKind === "audioinput");
    if (device === undefined) return noCaptureDevice();
    tracks.push(createMediaStreamTrack("audio", requireRecord(device).label));
  }
  if (input.video) {
    const device = record.devices.find(value =>
      requireRecord(value).deviceKind === "videoinput");
    if (device === undefined) return noCaptureDevice();
    tracks.push(createMediaStreamTrack("video", requireRecord(device).label));
  }
  if (tracks.length === 0) return noCaptureDevice();
  return Promise.resolve(new MediaStream(tracks));
}

function noCaptureDevice() {
  return Promise.reject(new DOMException(
    "No matching media capture device is available in the fingerprint.",
    "NotFoundError",
  ));
}

function configurationSupported(profile, configuration) {
  const entries = [
    [configuration.audio, profile.audioCodecs],
    [configuration.video, profile.videoCodecs],
  ].filter(([value]) => value !== undefined && value !== null);
  if (entries.length === 0) return false;
  return entries.every(([value, codecs]) => {
    const contentType = `${value.contentType ?? ""}`.toLowerCase();
    const match = /codecs\s*=\s*"?([^";,\s]+)/u.exec(contentType);
    if (match === null) return true;
    return codecs.some(codec =>
      match[1] === codec || match[1].startsWith(`${codec}.`));
  });
}

function copyMediaProfile(profile) {
  return Object.freeze({
    audioCodecs: Object.freeze([...(profile?.audioCodecs ?? [
      "opus", "vorbis", "mp4a", "flac", "pcm",
    ])]),
    videoCodecs: Object.freeze([...(profile?.videoCodecs ?? [
      "vp8", "vp09", "av01", "avc1", "hvc1", "hev1",
    ])]),
    imageTypes: Object.freeze([...(profile?.imageTypes ?? [
      "image/png", "image/jpeg", "image/webp", "image/gif", "image/avif",
    ])]),
    powerEfficient: Boolean(profile?.powerEfficient),
    captureEnabled: Boolean(profile?.captureEnabled),
  });
}

function createMediaKeys(access) {
  const value = Object.create(MediaKeys.prototype);
  state.set(value, {
    kind: "mediaKeys",
    keySystem: access.keySystem,
    serverCertificate: new ArrayBuffer(0),
  });
  return value;
}

function createMediaKeySession(keys, sessionType = "temporary") {
  const value = Object.create(MediaKeySession.prototype);
  initializeEventTarget(value);
  let resolveClosed;
  const closed = new Promise(resolve => {
    resolveClosed = resolve;
  });
  const keyStatuses = Object.create(MediaKeyStatusMap.prototype);
  state.set(keyStatuses, {
    kind: "keyStatusMap",
    values: new Map(),
  });
  state.set(value, {
    kind: "keySession",
    object: value,
    keys,
    sessionType: `${sessionType ?? "temporary"}`,
    sessionId: "",
    expiration: Number.NaN,
    closed,
    resolveClosed,
    keyStatuses,
    handlers: handlers(["onkeystatuseschange", "onmessage"]),
    removed: false,
  });
  return value;
}

function keySessionOperation(record, name, args) {
  if (name === "generateRequest") {
    const initDataType = `${args[0]}`;
    const initData = copyBuffer(args[1]);
    mediaAgencyState().nextSessionId += 1;
    record.sessionId = `edge-clearkey-${mediaAgencyState().nextSessionId}`;
    Promise.resolve().then(() => emit(
      record,
      new MediaKeyMessageEvent("message", {
        messageType: "license-request",
        message: initData,
      }),
      "onmessage",
    ));
    void initDataType;
    return Promise.resolve();
  }
  if (name === "update") {
    const response = copyBuffer(args[0]);
    const statusRecord = requireRecord(record.keyStatuses);
    statusRecord.values.set(response.slice(0, 16), "usable");
    Promise.resolve().then(() => emit(
      record,
      createEvent("keystatuseschange"),
      "onkeystatuseschange",
    ));
    return Promise.resolve();
  }
  if (name === "load") return Promise.resolve(false);
  if (name === "remove") {
    requireRecord(record.keyStatuses).values.clear();
    record.removed = true;
    return Promise.resolve();
  }
  if (name === "close") {
    record.resolveClosed();
    return Promise.resolve();
  }
}

function keyStatusMapOperation(record, object, name, args) {
  if (name === "get") return record.values.get(args[0]);
  if (name === "has") return record.values.has(args[0]);
  if (name === "entries") return record.values.entries();
  if (name === "keys") return record.values.keys();
  if (name === "values") return record.values.values();
  if (name === "forEach") {
    record.values.forEach((status, key) => {
      Reflect.apply(args[0], args[1], [status, key, object]);
    });
  }
}

function mediaSessionOperation(record, name, args) {
  if (name === "setActionHandler") {
    const action = `${args[0]}`;
    const handler = args[1];
    if (handler === null) record.actionHandlers.delete(action);
    else if (typeof handler === "function") record.actionHandlers.set(action, handler);
    else throw new TypeError("Media action handler must be callable or null");
    return;
  }
  if (name === "setPositionState") {
    const input = args[0];
    if (input === undefined) {
      record.positionState = null;
      return;
    }
    const duration = Number(input.duration);
    const playbackRate = Number(input.playbackRate ?? 1);
    const position = Number(input.position ?? 0);
    if (!(duration > 0) || !(playbackRate > 0)
      || position < 0 || position > duration) {
      throw new TypeError("Invalid media position state");
    }
    record.positionState = Object.freeze({ duration, playbackRate, position });
    return;
  }
  if (name === "setCameraActive" || name === "setMicrophoneActive") {
    const field = name === "setCameraActive"
      ? "cameraActive"
      : "microphoneActive";
    record[field] = Boolean(args[0]);
    return Promise.resolve(false);
  }
}

function captureControllerOperation(record, name, args) {
  if (name === "setFocusBehavior") {
    record.focusBehavior = `${args[0]}`;
    return;
  }
  if (name === "getSupportedZoomLevels") {
    return Promise.resolve(Object.freeze([100]));
  }
  if (name === "increaseZoomLevel"
    || name === "decreaseZoomLevel"
    || name === "resetZoomLevel") {
    record.zoomLevel = 100;
    return Promise.resolve(100);
  }
  if (name === "forwardWheel") {
    return Promise.reject(new DOMException(
      "No captured surface is attached.",
      "InvalidStateError",
    ));
  }
}

function imageCaptureOperation(record, name) {
  const track = requireMediaStreamTrack(record.track);
  if (track.readyState === "ended") {
    return Promise.reject(new DOMException("The track has ended.", "InvalidStateError"));
  }
  if (name === "getPhotoCapabilities") {
    return Promise.resolve(Object.freeze({
      redEyeReduction: "never",
      imageHeight: Object.freeze({ min: 1, max: 480, step: 1 }),
      imageWidth: Object.freeze({ min: 1, max: 640, step: 1 }),
      fillLightMode: Object.freeze([]),
    }));
  }
  if (name === "getPhotoSettings") {
    return Promise.resolve(Object.freeze({
      imageHeight: 480,
      imageWidth: 640,
      fillLightMode: "off",
      redEyeReduction: false,
    }));
  }
  if (name === "grabFrame") {
    return Promise.resolve(createImageBitmap(
      640,
      480,
      new Uint8ClampedArray(640 * 480 * 4),
    ));
  }
  if (name === "takePhoto") {
    return Promise.resolve(new Blob([], { type: "image/png" }));
  }
}

function createVideoStats() {
  const value = Object.create(MediaStreamTrackVideoStats.prototype);
  state.set(value, {
    kind: "videoStats",
    deliveredFrames: 0,
    discardedFrames: 0,
    totalFrames: 0,
  });
  return value;
}

function createEvent(type) {
  const event = Object.create(Event.prototype);
  initializeEvent(event, type, {});
  return event;
}

function emit(record, event, handlerName) {
  record.object.dispatchEvent(event);
  const handler = record.handlers.get(handlerName);
  if (handler !== null) Reflect.apply(handler, record.object, [event]);
}

function copyBuffer(value) {
  if (value === null || value === undefined) return null;
  if (value instanceof ArrayBuffer) return value.slice(0);
  if (ArrayBuffer.isView(value)) {
    return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength);
  }
  return new Uint8Array(value).buffer;
}

function freezeConfiguration(value) {
  if (value === null || typeof value !== "object") return Object.freeze({});
  const output = {};
  for (const [name, entry] of Object.entries(value)) {
    output[name] = Array.isArray(entry)
      ? Object.freeze(entry.map(item => freezeConfiguration(item)))
      : entry !== null && typeof entry === "object"
        ? freezeConfiguration(entry)
        : entry;
  }
  return Object.freeze(output);
}

function normalizeArtwork(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isObject)
    .map(item => ({
      src: `${item.src ?? ""}`,
      sizes: `${item.sizes ?? ""}`,
      type: `${item.type ?? ""}`,
    }));
}

function normalizeChapters(value) {
  if (!Array.isArray(value)) return [];
  return value
    .filter(isObject)
    .map(item => ({
      title: `${item.title ?? ""}`,
      startTime: Number(item.startTime ?? 0),
      artwork: normalizeArtwork(item.artwork),
    }));
}

function isObject(value) {
  return (typeof value === "object" && value !== null)
    || typeof value === "function";
}

function eventInit(init) {
  return {
    bubbles: Boolean(init.bubbles),
    cancelable: Boolean(init.cancelable),
    composed: Boolean(init.composed),
  };
}

function handlers(names) {
  return new Map(names.map(name => [name, null]));
}

function deviceInfoJSON(record) {
  return {
    deviceId: record.deviceId,
    kind: record.deviceKind,
    label: record.label,
    groupId: record.groupId,
  };
}

function requireRecord(value) {
  const record = state.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function requireNew(newTarget, name) {
  if (newTarget === undefined) {
    throw new TypeError(`Failed to construct '${name}': use new`);
  }
}

function illegalConstructor(name) {
  // 真实 Chromium：`Failed to construct 'Node': Illegal constructor`
  // 不带接口名的裸文案是可检测偏差。
  throw new TypeError(
    name === undefined
      ? "Illegal constructor"
      : `Failed to construct '${name}': Illegal constructor`,
  );
}
