import { DOMException } from "../event/dom-exception-constructor.js";
import { initializeEventTarget } from "../event/event-target-state.js";
import { Window } from "./window-constructor.js";
import {
  resizeWindowBy,
  resizeWindowTo,
  scrollWindowBy,
  scrollWindowTo,
} from "./window-state-globals-runtime.js";
import { requireImageData } from "../canvas/image-data-state.js";
import {
  createImageBitmap as createBitmap,
  snapshotImageBitmap,
} from "../canvas/image-bitmap-state.js";
import {
  snapshotHTMLCanvas,
} from "../canvas/html-canvas-element-state.js";
import {
  snapshotOffscreenCanvas,
} from "../canvas/offscreen-canvas-state.js";
import { registerNativeFunction } from "../../../engine/webidl/native-function.js";
import { defineGlobalFunction } from "../../../engine/webidl/descriptor.js";

const virtualWindows = new WeakMap();
const fileSystems = new Map();
const fileEntries = new WeakMap();
const entriesByUrl = new Map();
let capturedEventMask = 0;
let lastAlert = "";

export function installWindowLegacyGlobals() {
  for (const callback of [
    alert,
    blur,
    captureEvents,
    close,
    confirm,
    find,
    focus,
    moveBy,
    moveTo,
    open,
    print,
    prompt,
    releaseEvents,
    resizeBy,
    resizeTo,
    scroll,
    scrollBy,
    scrollTo,
    stop,
    webkitCancelAnimationFrame,
    webkitRequestAnimationFrame,
    getDigitalGoodsService,
    webkitRequestFileSystem,
    webkitResolveLocalFileSystemURL,
  ]) {
    defineGlobalFunction(callback.name, callback);
  }
  installCreateImageBitmapGlobal();
  installTemporalGlobal();
  Object.defineProperty(globalThis, "chrome", {
    value: createChromeCompatibility(),
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

export function installTemporalGlobal() {
  Object.defineProperty(globalThis, "Temporal", {
    value: createTemporalNamespace(),
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

export function installCreateImageBitmapGlobal() {
  defineGlobalFunction("createImageBitmap", createImageBitmap);
}

export function alert() {
  lastAlert = `${arguments[0]}`;
}

export function blur() {}

export function captureEvents() {
  capturedEventMask = Number(arguments[0]) >>> 0;
}

export function close() {}

export function confirm() {
  void `${arguments[0] ?? ""}`;
  return false;
}

export function createImageBitmap(source) {
  if (arguments.length === 0) {
    throw new TypeError(
      "Failed to execute 'createImageBitmap' on 'Window': "
        + "1 argument required, but only 0 present.",
    );
  }
  const snapshot = imageSourceSnapshot(source);
  if (snapshot === undefined) {
    throw new TypeError(
      "Failed to execute 'createImageBitmap' on 'Window': "
        + "The provided value is not a valid image source.",
    );
  }
  let { width, height, pixels } = snapshot;
  let options;
  if (arguments.length >= 5) {
    const cropWidth = Math.trunc(Number(arguments[3]));
    const cropHeight = Math.trunc(Number(arguments[4]));
    if (cropWidth === 0 || cropHeight === 0) {
      return Promise.reject(new DOMException(
        "The crop rectangle has zero width or height.",
        "InvalidStateError",
      ));
    }
    ({ width, height, pixels } = cropPixels(
      width,
      height,
      pixels,
      Math.trunc(Number(arguments[1])),
      Math.trunc(Number(arguments[2])),
      cropWidth,
      cropHeight,
    ));
    options = arguments[5];
  } else {
    options = arguments[1];
  }
  if (options !== null && typeof options === "object") {
    const resizeWidth = bitmapDimension(options.resizeWidth, width);
    const resizeHeight = bitmapDimension(options.resizeHeight, height);
    if (resizeWidth === 0 || resizeHeight === 0) {
      return Promise.reject(new DOMException(
        "The resizeWidth and resizeHeight options must be greater than zero.",
        "InvalidStateError",
      ));
    }
    if (resizeWidth !== width || resizeHeight !== height) {
      pixels = resizePixels(
        pixels,
        width,
        height,
        resizeWidth,
        resizeHeight,
      );
      width = resizeWidth;
      height = resizeHeight;
    }
  }
  return Promise.resolve(createBitmap(width, height, pixels));
}

export function find() {
  const query = `${arguments[0]}`;
  if (query === "") return false;
  const caseSensitive = Boolean(arguments[1]);
  const wholeWord = Boolean(arguments[4]);
  const content = `${globalThis.document?.textContent ?? ""}`;
  const haystack = caseSensitive ? content : content.toLowerCase();
  const needle = caseSensitive ? query : query.toLowerCase();
  if (!wholeWord) return haystack.includes(needle);
  return haystack.split(/[^\p{L}\p{N}_]+/u).includes(needle);
}

export function focus() {}

export function moveBy(x, y) {
  void Number(x);
  void Number(y);
}

export function moveTo(x, y) {
  void Number(x);
  void Number(y);
}

export function open() {
  const url = arguments[0] === undefined ? "" : `${arguments[0]}`;
  const target = arguments[1] === undefined ? "_blank" : `${arguments[1]}`;
  if (["_self", "_top", "_parent"].includes(target)) return globalThis;
  const child = Object.create(Window.prototype);
  initializeEventTarget(child);
  const record = { name: target, url, closed: false };
  virtualWindows.set(child, record);
  Object.defineProperties(child, {
    closed: {
      get() { return requireVirtualWindow(this).closed; },
      enumerable: true,
      configurable: true,
    },
    name: {
      get() { return requireVirtualWindow(this).name; },
      set(value) { requireVirtualWindow(this).name = `${value}`; },
      enumerable: true,
      configurable: true,
    },
    location: {
      get() { return requireVirtualWindow(this).url; },
      enumerable: true,
      configurable: true,
    },
    opener: dataDescriptor(globalThis),
    window: dataDescriptor(child),
    self: dataDescriptor(child),
    top: dataDescriptor(child),
    parent: dataDescriptor(child),
    close: dataDescriptor(function close() {
      requireVirtualWindow(this).closed = true;
    }),
  });
  registerNativeFunction(child.close, "close");
  return child;
}

export function print() {}

export function prompt() {
  void `${arguments[0] ?? ""}`;
  void `${arguments[1] ?? ""}`;
  return null;
}

export function releaseEvents() {
  capturedEventMask &= ~(Number(arguments[0]) >>> 0);
}

export function resizeBy(width, height) {
  resizeWindowBy(width, height);
}

export function resizeTo(width, height) {
  resizeWindowTo(width, height);
}

export function scroll() {
  const [x, y] = scrollCoordinates(arguments);
  scrollWindowTo(x, y);
  globalThis.dispatchEvent(new Event("scroll"));
}

export function scrollBy() {
  const [x, y] = scrollCoordinates(arguments, true);
  scrollWindowBy(x, y);
  globalThis.dispatchEvent(new Event("scroll"));
}

export function scrollTo() {
  const [x, y] = scrollCoordinates(arguments);
  scrollWindowTo(x, y);
  globalThis.dispatchEvent(new Event("scroll"));
}

export function stop() {}

export function webkitCancelAnimationFrame(handle) {
  return globalThis.cancelAnimationFrame(handle);
}

export function webkitRequestAnimationFrame(callback) {
  return globalThis.requestAnimationFrame(callback);
}

export function getDigitalGoodsService(provider) {
  if (arguments.length === 0) {
    throw new TypeError(
      "Failed to execute 'getDigitalGoodsService' on 'Window': "
        + "1 argument required, but only 0 present.",
    );
  }
  return Promise.resolve(createDigitalGoodsService(`${provider}`));
}

export function webkitRequestFileSystem(type, size, successCallback) {
  void Number(size);
  if (typeof successCallback !== "function") {
    throw new TypeError(
      "Failed to execute 'webkitRequestFileSystem': "
        + "the success callback is required.",
    );
  }
  const errorCallback = arguments[3];
  if (!["http:", "https:"].includes(globalThis.location.protocol)) {
    scheduleCallback(errorCallback, new DOMException(
      "It is unsafe to access the file system from this context.",
      "SecurityError",
    ));
    return;
  }
  const normalizedType = Math.trunc(Number(type));
  if (normalizedType !== 0 && normalizedType !== 1) {
    scheduleCallback(errorCallback, new DOMException(
      "The requested file system type is not supported.",
      "NotSupportedError",
    ));
    return;
  }
  const key = `${globalThis.location.origin}\u0000${normalizedType}`;
  let fileSystem = fileSystems.get(key);
  if (fileSystem === undefined) {
    fileSystem = createFileSystem(normalizedType);
    fileSystems.set(key, fileSystem);
  }
  scheduleCallback(successCallback, fileSystem);
}

export function webkitResolveLocalFileSystemURL(url, successCallback) {
  if (typeof successCallback !== "function") {
    throw new TypeError(
      "Failed to execute 'webkitResolveLocalFileSystemURL': "
        + "the success callback is required.",
    );
  }
  const errorCallback = arguments[2];
  const entry = entriesByUrl.get(`${url}`)
    ?? entriesByUrl.get(`${url}`.endsWith("/") ? `${url}` : `${url}/`);
  if (entry !== undefined) {
    scheduleCallback(successCallback, entry);
  } else {
    scheduleCallback(errorCallback, new DOMException(
      `No file system entry exists for '${url}'.`,
      "NotFoundError",
    ));
  }
}

function imageSourceSnapshot(source) {
  try {
    const record = requireImageData(source);
    return {
      width: record.width,
      height: record.height,
      pixels: new Uint8ClampedArray(record.data),
    };
  } catch {}
  try {
    const snapshot = snapshotImageBitmap(source);
    if (snapshot !== undefined) return snapshot;
  } catch {}
  try {
    return snapshotOffscreenCanvas(source);
  } catch {}
  try {
    return snapshotHTMLCanvas(source);
  } catch {}
  return undefined;
}

function cropPixels(
  sourceWidth,
  sourceHeight,
  source,
  sourceX,
  sourceY,
  cropWidth,
  cropHeight,
) {
  const width = Math.abs(cropWidth);
  const height = Math.abs(cropHeight);
  const startX = cropWidth < 0 ? sourceX + cropWidth : sourceX;
  const startY = cropHeight < 0 ? sourceY + cropHeight : sourceY;
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const inputX = startX + x;
      const inputY = startY + y;
      if (
        inputX < 0
        || inputY < 0
        || inputX >= sourceWidth
        || inputY >= sourceHeight
      ) continue;
      const input = (inputY * sourceWidth + inputX) * 4;
      pixels.set(source.subarray(input, input + 4), (y * width + x) * 4);
    }
  }
  return { width, height, pixels };
}

function resizePixels(source, width, height, newWidth, newHeight) {
  const pixels = new Uint8ClampedArray(newWidth * newHeight * 4);
  for (let y = 0; y < newHeight; y += 1) {
    for (let x = 0; x < newWidth; x += 1) {
      const inputX = Math.floor(x * width / newWidth);
      const inputY = Math.floor(y * height / newHeight);
      const input = (inputY * width + inputX) * 4;
      pixels.set(source.subarray(input, input + 4), (y * newWidth + x) * 4);
    }
  }
  return pixels;
}

function requireVirtualWindow(value) {
  const record = virtualWindows.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function dataDescriptor(value) {
  return {
    value,
    writable: true,
    enumerable: true,
    configurable: true,
  };
}

function scrollCoordinates(args, relative = false) {
  const options = args[0];
  if (options !== null && typeof options === "object") {
    return [
      Number(options.left ?? (relative ? 0 : globalThis.scrollX)),
      Number(options.top ?? (relative ? 0 : globalThis.scrollY)),
    ];
  }
  return [Number(args[0] ?? 0), Number(args[1] ?? 0)];
}

function createDigitalGoodsService(provider) {
  const state = new WeakSet();
  const prototype = {};
  const methods = {
    getDetails: function getDetails(itemIds) {
      requireDigitalGoods(this, state);
      if (!Array.isArray(itemIds)) {
        throw new TypeError("Item identifiers must be an array.");
      }
      return Promise.resolve(itemIds.map(itemId => ({
        itemId,
        title: `${itemId}`,
        description: "Offline catalog item",
        price: { currency: "USD", value: "0.00" },
        type: "product",
      })));
    },
    listPurchases: function listPurchases() {
      requireDigitalGoods(this, state);
      return Promise.resolve([]);
    },
    listPurchaseHistory: function listPurchaseHistory() {
      requireDigitalGoods(this, state);
      return Promise.resolve([]);
    },
    consume: function consume() {
      requireDigitalGoods(this, state);
      if (arguments.length === 0) {
        throw new TypeError("A purchase token is required.");
      }
      return Promise.resolve();
    },
  };
  const lengths = {
    getDetails: 1,
    listPurchases: 0,
    listPurchaseHistory: 0,
    consume: 1,
  };
  for (const [name, callback] of Object.entries(methods)) {
    Object.defineProperty(callback, "length", {
      value: lengths[name],
      configurable: true,
    });
    registerNativeFunction(callback, name);
    Object.defineProperty(prototype, name, dataDescriptor(callback));
  }
  const service = Object.create(prototype);
  Object.defineProperty(service, "paymentMethod", {
    value: provider,
    writable: false,
    enumerable: false,
    configurable: true,
  });
  state.add(service);
  return service;
}

function requireDigitalGoods(value, state) {
  if (!state.has(value)) throw new TypeError("Illegal invocation");
}

function createFileSystem(type) {
  const storageName = type === 0 ? "Temporary" : "Persistent";
  const storagePath = type === 0 ? "temporary" : "persistent";
  const origin = globalThis.location.origin;
  const rootUrl = `filesystem:${origin}/${storagePath}/`;
  const fileSystem = {};
  const root = createEntry(fileSystem, {
    name: "",
    fullPath: "/",
    url: rootUrl,
    isFile: false,
  });
  Object.defineProperties(fileSystem, {
    name: readonlyDescriptor(
      `${globalThis.location.protocol.slice(0, -1)}_`
        + `${globalThis.location.hostname}_`
        + `${globalThis.location.port || 0}:${storageName}`,
    ),
    root: readonlyDescriptor(root),
    [Symbol.toStringTag]: tagDescriptor("DOMFileSystem"),
  });
  return fileSystem;
}

function createEntry(fileSystem, record) {
  const entry = {};
  const methods = {
    toURL: function toURL() {
      return requireEntry(this).url;
    },
    getParent: function getParent(success) {
      const current = requireEntry(this);
      scheduleCallback(success, current.fullPath === "/"
        ? this
        : fileSystem.root);
    },
    getMetadata: function getMetadata(success) {
      requireEntry(this);
      scheduleCallback(success, {
        modificationTime: new Date(0),
        size: 0,
      });
    },
    remove: function remove(success, error) {
      const current = requireEntry(this);
      if (current.fullPath === "/") {
        scheduleCallback(error, new DOMException(
          "The root directory cannot be removed.",
          "NoModificationAllowedError",
        ));
        return;
      }
      entriesByUrl.delete(current.url);
      scheduleCallback(success, undefined);
    },
  };
  if (!record.isFile) {
    methods.getFile = directoryChildFactory(fileSystem, true);
    methods.getDirectory = directoryChildFactory(fileSystem, false);
    methods.createReader = function createReader() {
      requireEntry(this);
      const readEntries = function readEntries(success) {
        scheduleCallback(success, []);
      };
      Object.defineProperty(readEntries, "length", {
        value: 2,
        configurable: true,
      });
      registerNativeFunction(readEntries, "readEntries");
      const reader = {};
      Object.defineProperties(reader, {
        readEntries: dataDescriptor(readEntries),
        [Symbol.toStringTag]: tagDescriptor("DirectoryReader"),
      });
      return reader;
    };
    methods.removeRecursively = methods.remove;
  } else {
    methods.file = function file(success) {
      const current = requireEntry(this);
      scheduleCallback(success, new File([], current.name));
    };
  }
  const lengths = {
    toURL: 0,
    getParent: 2,
    getMetadata: 2,
    remove: 2,
    getFile: 3,
    getDirectory: 3,
    createReader: 0,
    removeRecursively: 2,
    file: 2,
  };
  for (const [name, callback] of Object.entries(methods)) {
    Object.defineProperty(callback, "length", {
      value: lengths[name],
      configurable: true,
    });
    registerNativeFunction(callback, name);
    Object.defineProperty(entry, name, dataDescriptor(callback));
  }
  Object.defineProperties(entry, {
    filesystem: readonlyDescriptor(fileSystem),
    isFile: readonlyDescriptor(record.isFile),
    isDirectory: readonlyDescriptor(!record.isFile),
    name: readonlyDescriptor(record.name),
    fullPath: readonlyDescriptor(record.fullPath),
    [Symbol.toStringTag]: tagDescriptor(
      record.isFile ? "FileEntry" : "DirectoryEntry",
    ),
  });
  fileEntries.set(entry, record);
  entriesByUrl.set(record.url, entry);
  return entry;
}

function directoryChildFactory(fileSystem, isFile) {
  return function child(path, options, success) {
    void options;
    const parent = requireEntry(this);
    const name = `${path}`.replace(/^\/+|\/+$/gu, "").split("/").at(-1);
    if (!name || name === "." || name === "..") {
      scheduleCallback(arguments[3], new DOMException(
        "The supplied path is invalid.",
        "EncodingError",
      ));
      return;
    }
    const fullPath = `${parent.fullPath.replace(/\/$/u, "")}/${name}`
      + (isFile ? "" : "/");
    const url = `${parent.url.replace(/\/$/u, "")}/${name}`
      + (isFile ? "" : "/");
    let entry = entriesByUrl.get(url);
    if (entry === undefined) {
      entry = createEntry(fileSystem, {
        name,
        fullPath,
        url,
        isFile,
      });
    }
    scheduleCallback(success, entry);
  };
}

function requireEntry(value) {
  const record = fileEntries.get(value);
  if (record === undefined) throw new TypeError("Illegal invocation");
  return record;
}

function scheduleCallback(callback, value) {
  if (typeof callback === "function") {
    queueMicrotask(() => Reflect.apply(callback, undefined, [value]));
  }
}

function readonlyDescriptor(value) {
  return {
    value,
    writable: false,
    enumerable: true,
    configurable: false,
  };
}

function tagDescriptor(value) {
  return {
    value,
    writable: false,
    enumerable: false,
    configurable: true,
  };
}

function createChromeCompatibility() {
  const loadTimes = function () {
    const now = Date.now() / 1000;
    return {
      requestTime: now,
      startLoadTime: now,
      commitLoadTime: 0,
      finishDocumentLoadTime: now,
      finishLoadTime: now,
      firstPaintTime: 0,
      firstPaintAfterLoadTime: 0,
      navigationType: "Other",
      wasFetchedViaSpdy: false,
      wasNpnNegotiated: false,
      npnNegotiatedProtocol: "",
      wasAlternateProtocolAvailable: false,
      connectionInfo: "unknown",
    };
  };
  const csi = function () {
    const now = Date.now();
    return { startE: now, onloadT: now, pageT: 0, tran: 15 };
  };
  Object.defineProperty(loadTimes, "name", {
    value: "",
    configurable: true,
  });
  Object.defineProperty(csi, "name", {
    value: "",
    configurable: true,
  });
  registerNativeFunction(loadTimes, "");
  registerNativeFunction(csi, "");
  const app = {
    isInstalled: false,
    getDetails() { return null; },
    getIsInstalled() { return false; },
    installState(callback) {
      if (typeof callback === "function") callback("not_installed");
    },
    runningState() { return "cannot_run"; },
    InstallState: {
      DISABLED: "disabled",
      INSTALLED: "installed",
      NOT_INSTALLED: "not_installed",
    },
    RunningState: {
      CANNOT_RUN: "cannot_run",
      READY_TO_RUN: "ready_to_run",
      RUNNING: "running",
    },
  };
  for (
    const name of [
      "getDetails",
      "getIsInstalled",
      "installState",
      "runningState",
    ]
  ) registerNativeFunction(app[name], name);
  return { loadTimes, csi, app, runtime: createChromeRuntime() };
}

function createChromeRuntime() {
  const noOp = function() {};
  const runtime = {
    id: undefined,
    connect: noOp,
    sendMessage: noOp,
    onMessage: { addListener: noOp, removeListener: noOp, hasListener: noOp },
    onConnect: { addListener: noOp, removeListener: noOp, hasListener: noOp },
    onInstalled: { addListener: noOp, removeListener: noOp, hasListener: noOp },
    getURL: function getURL(path) { return `chrome-extension://undefined/${path}`; },
    getManifest: function getManifest() { return {}; },
    lastError: undefined,
  };
  for (const name of ["connect","sendMessage","getURL","getManifest"]) {
    registerNativeFunction(runtime[name], name);
  }
  return runtime;
}

function createTemporalNamespace() {
  class Instant {
    constructor(epochNanoseconds) {
      this.epochNanoseconds = BigInt(epochNanoseconds);
      this.epochMilliseconds = Number(this.epochNanoseconds / 1000000n);
    }
    static from(value) {
      if (value instanceof Instant) return value;
      return new Instant(BigInt(Date.parse(`${value}`)) * 1000000n);
    }
    static fromEpochMilliseconds(value) {
      return new Instant(BigInt(Math.trunc(Number(value))) * 1000000n);
    }
    static fromEpochNanoseconds(value) { return new Instant(value); }
    static compare(left, right) {
      const a = Instant.from(left).epochNanoseconds;
      const b = Instant.from(right).epochNanoseconds;
      return a < b ? -1 : a > b ? 1 : 0;
    }
    add(duration) {
      return new Instant(
        this.epochNanoseconds + durationNanoseconds(duration),
      );
    }
    subtract(duration) {
      return new Instant(
        this.epochNanoseconds - durationNanoseconds(duration),
      );
    }
    equals(other) { return Instant.compare(this, other) === 0; }
    toString() { return new Date(this.epochMilliseconds).toISOString(); }
    toJSON() { return this.toString(); }
    valueOf() { throw new TypeError("use Temporal.Instant.compare"); }
  }

  class PlainDate {
    constructor(year, month, day) {
      this.year = Math.trunc(Number(year));
      this.month = Math.trunc(Number(month));
      this.day = Math.trunc(Number(day));
      validateDate(this.year, this.month, this.day);
    }
    static from(value) {
      if (value instanceof PlainDate) return value;
      if (typeof value === "string") {
        const [year, month, day] = value.split("-").map(Number);
        return new PlainDate(year, month, day);
      }
      return new PlainDate(value.year, value.month, value.day);
    }
    static compare(left, right) {
      return PlainDate.from(left).toString()
        .localeCompare(PlainDate.from(right).toString());
    }
    add(duration) {
      const date = new Date(Date.UTC(this.year, this.month - 1, this.day));
      date.setUTCFullYear(date.getUTCFullYear() + Number(duration.years ?? 0));
      date.setUTCMonth(date.getUTCMonth() + Number(duration.months ?? 0));
      date.setUTCDate(
        date.getUTCDate()
          + Number(duration.weeks ?? 0) * 7
          + Number(duration.days ?? 0),
      );
      return new PlainDate(
        date.getUTCFullYear(),
        date.getUTCMonth() + 1,
        date.getUTCDate(),
      );
    }
    subtract(duration) { return this.add(negateDuration(duration)); }
    equals(other) { return PlainDate.compare(this, other) === 0; }
    toString() {
      return `${padYear(this.year)}-${pad2(this.month)}-${pad2(this.day)}`;
    }
    toJSON() { return this.toString(); }
    valueOf() { throw new TypeError("use Temporal.PlainDate.compare"); }
  }

  class PlainTime {
    constructor(hour = 0, minute = 0, second = 0, millisecond = 0) {
      this.hour = Math.trunc(Number(hour));
      this.minute = Math.trunc(Number(minute));
      this.second = Math.trunc(Number(second));
      this.millisecond = Math.trunc(Number(millisecond));
    }
    static from(value) {
      if (value instanceof PlainTime) return value;
      if (typeof value === "string") {
        const [hour, minute, tail = "0"] = value.split(":");
        const [second, fraction = "0"] = tail.split(".");
        return new PlainTime(
          hour,
          minute,
          second,
          fraction.slice(0, 3).padEnd(3, "0"),
        );
      }
      return new PlainTime(
        value.hour,
        value.minute,
        value.second,
        value.millisecond,
      );
    }
    static compare(left, right) {
      return PlainTime.from(left).toString()
        .localeCompare(PlainTime.from(right).toString());
    }
    toString() {
      const fraction = this.millisecond === 0
        ? ""
        : `.${`${this.millisecond}`.padStart(3, "0")}`;
      return `${pad2(this.hour)}:${pad2(this.minute)}:`
        + `${pad2(this.second)}${fraction}`;
    }
    toJSON() { return this.toString(); }
  }

  class PlainDateTime {
    constructor(
      year,
      month,
      day,
      hour = 0,
      minute = 0,
      second = 0,
      millisecond = 0,
    ) {
      Object.assign(this, new PlainDate(year, month, day));
      Object.assign(
        this,
        new PlainTime(hour, minute, second, millisecond),
      );
    }
    static from(value) {
      if (value instanceof PlainDateTime) return value;
      if (typeof value === "string") {
        const [date, time = "00:00:00"] = value.split("T");
        const parsedDate = PlainDate.from(date);
        const parsedTime = PlainTime.from(time);
        return new PlainDateTime(
          parsedDate.year,
          parsedDate.month,
          parsedDate.day,
          parsedTime.hour,
          parsedTime.minute,
          parsedTime.second,
          parsedTime.millisecond,
        );
      }
      return new PlainDateTime(
        value.year,
        value.month,
        value.day,
        value.hour,
        value.minute,
        value.second,
        value.millisecond,
      );
    }
    static compare(left, right) {
      return PlainDateTime.from(left).toString()
        .localeCompare(PlainDateTime.from(right).toString());
    }
    toPlainDate() {
      return new PlainDate(this.year, this.month, this.day);
    }
    toPlainTime() {
      return new PlainTime(
        this.hour,
        this.minute,
        this.second,
        this.millisecond,
      );
    }
    toString() {
      return `${this.toPlainDate()}T${this.toPlainTime()}`;
    }
    toJSON() { return this.toString(); }
  }

  class Duration {
    constructor(
      years = 0,
      months = 0,
      weeks = 0,
      days = 0,
      hours = 0,
      minutes = 0,
      seconds = 0,
      milliseconds = 0,
      microseconds = 0,
      nanoseconds = 0,
    ) {
      Object.assign(this, {
        years: Number(years),
        months: Number(months),
        weeks: Number(weeks),
        days: Number(days),
        hours: Number(hours),
        minutes: Number(minutes),
        seconds: Number(seconds),
        milliseconds: Number(milliseconds),
        microseconds: Number(microseconds),
        nanoseconds: Number(nanoseconds),
      });
    }
    static from(value) {
      if (value instanceof Duration) return value;
      if (typeof value === "string") return parseDuration(value);
      return new Duration(
        value.years,
        value.months,
        value.weeks,
        value.days,
        value.hours,
        value.minutes,
        value.seconds,
        value.milliseconds,
        value.microseconds,
        value.nanoseconds,
      );
    }
    static compare(left, right) {
      const a = durationNanoseconds(Duration.from(left));
      const b = durationNanoseconds(Duration.from(right));
      return a < b ? -1 : a > b ? 1 : 0;
    }
    negated() { return Duration.from(negateDuration(this)); }
    abs() {
      return new Duration(...durationFields.map(name => Math.abs(this[name])));
    }
    toString() {
      return `P${this.years ? `${this.years}Y` : ""}`
        + `${this.months ? `${this.months}M` : ""}`
        + `${this.weeks ? `${this.weeks}W` : ""}`
        + `${this.days ? `${this.days}D` : ""}`
        + `T${this.hours ? `${this.hours}H` : ""}`
        + `${this.minutes ? `${this.minutes}M` : ""}`
        + `${this.seconds || !durationFields.some(name => this[name])
          ? `${this.seconds}S`
          : ""}`;
    }
    toJSON() { return this.toString(); }
  }

  class PlainMonthDay {
    constructor(month, day) {
      this.month = Math.trunc(Number(month));
      this.day = Math.trunc(Number(day));
      validateDate(2000, this.month, this.day);
    }
    static from(value) {
      if (value instanceof PlainMonthDay) return value;
      if (typeof value === "string") {
        const parts = value.replace(/^--/u, "").split("-");
        return new PlainMonthDay(parts.at(-2), parts.at(-1));
      }
      return new PlainMonthDay(value.month, value.day);
    }
    toString() { return `--${pad2(this.month)}-${pad2(this.day)}`; }
    toJSON() { return this.toString(); }
  }

  class PlainYearMonth {
    constructor(year, month) {
      this.year = Math.trunc(Number(year));
      this.month = Math.trunc(Number(month));
      validateDate(this.year, this.month, 1);
    }
    static from(value) {
      if (value instanceof PlainYearMonth) return value;
      if (typeof value === "string") {
        const [year, month] = value.split("-").map(Number);
        return new PlainYearMonth(year, month);
      }
      return new PlainYearMonth(value.year, value.month);
    }
    static compare(left, right) {
      return PlainYearMonth.from(left).toString()
        .localeCompare(PlainYearMonth.from(right).toString());
    }
    toString() { return `${padYear(this.year)}-${pad2(this.month)}`; }
    toJSON() { return this.toString(); }
  }

  class ZonedDateTime {
    constructor(epochNanoseconds, timeZone) {
      this.epochNanoseconds = BigInt(epochNanoseconds);
      this.timeZoneId = `${timeZone}`;
      this.epochMilliseconds = Number(this.epochNanoseconds / 1000000n);
    }
    static from(value) {
      if (value instanceof ZonedDateTime) return value;
      if (typeof value === "string") {
        const match = /^(.*)\[([^\]]+)\]$/u.exec(value);
        if (match === null) throw new RangeError("Invalid ZonedDateTime");
        return new ZonedDateTime(
          BigInt(Date.parse(match[1])) * 1000000n,
          match[2],
        );
      }
      return new ZonedDateTime(value.epochNanoseconds, value.timeZone);
    }
    static compare(left, right) {
      const a = ZonedDateTime.from(left).epochNanoseconds;
      const b = ZonedDateTime.from(right).epochNanoseconds;
      return a < b ? -1 : a > b ? 1 : 0;
    }
    toString() {
      return `${new Date(this.epochMilliseconds).toISOString()}`
        + `[${this.timeZoneId}]`;
    }
    toJSON() { return this.toString(); }
  }

  const Now = Object.freeze({
    instant() { return Instant.fromEpochMilliseconds(Date.now()); },
    plainDateISO() {
      const date = new Date();
      return new PlainDate(
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
      );
    },
    plainTimeISO() {
      const date = new Date();
      return new PlainTime(
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds(),
      );
    },
    plainDateTimeISO() {
      const date = this.plainDateISO();
      const time = this.plainTimeISO();
      return new PlainDateTime(
        date.year,
        date.month,
        date.day,
        time.hour,
        time.minute,
        time.second,
        time.millisecond,
      );
    },
    timeZoneId() {
      return Intl.DateTimeFormat().resolvedOptions().timeZone;
    },
  });
  for (const name of Object.keys(Now)) {
    registerNativeFunction(Now[name], name);
  }
  for (
    const Constructor of [
      Instant,
      PlainDate,
      PlainTime,
      PlainDateTime,
      Duration,
      PlainMonthDay,
      PlainYearMonth,
      ZonedDateTime,
    ]
  ) {
    Object.defineProperty(Constructor.prototype, Symbol.toStringTag, {
      value: `Temporal.${Constructor.name}`,
      configurable: true,
    });
    registerNativeFunction(Constructor, Constructor.name);
    for (
      const name of Object.getOwnPropertyNames(Constructor)
        .concat(Object.getOwnPropertyNames(Constructor.prototype))
    ) {
      const holder = Object.hasOwn(Constructor, name)
        ? Constructor
        : Constructor.prototype;
      const callback = Object.getOwnPropertyDescriptor(holder, name)?.value;
      if (typeof callback === "function") {
        registerNativeFunction(callback, name === "constructor"
          ? Constructor.name
          : name);
      }
    }
  }
  const temporal = {
    Now,
    Instant,
    PlainDate,
    PlainTime,
    PlainDateTime,
    Duration,
    PlainMonthDay,
    PlainYearMonth,
    ZonedDateTime,
  };
  Object.getOwnPropertyNames(temporal).forEach(name => {
    Object.defineProperty(temporal, name, {
      enumerable: false,
    });
  });
  Object.defineProperty(temporal, Symbol.toStringTag, {
    value: "Temporal",
    configurable: true,
  });
  return temporal;
}

const durationFields = [
  "years",
  "months",
  "weeks",
  "days",
  "hours",
  "minutes",
  "seconds",
  "milliseconds",
  "microseconds",
  "nanoseconds",
];

function durationNanoseconds(value) {
  const duration = value instanceof Object ? value : {};
  const milliseconds =
    Number(duration.weeks ?? 0) * 7 * 86400000
    + Number(duration.days ?? 0) * 86400000
    + Number(duration.hours ?? 0) * 3600000
    + Number(duration.minutes ?? 0) * 60000
    + Number(duration.seconds ?? 0) * 1000
    + Number(duration.milliseconds ?? 0);
  return BigInt(Math.trunc(milliseconds)) * 1000000n
    + BigInt(Math.trunc(Number(duration.microseconds ?? 0))) * 1000n
    + BigInt(Math.trunc(Number(duration.nanoseconds ?? 0)));
}

function negateDuration(value) {
  return Object.fromEntries(
    durationFields.map(name => [name, -Number(value[name] ?? 0)]),
  );
}

function parseDuration(value) {
  const match = /^P(?:(-?\d+)Y)?(?:(-?\d+)M)?(?:(-?\d+)W)?(?:(-?\d+)D)?(?:T(?:(-?\d+)H)?(?:(-?\d+)M)?(?:(-?\d+(?:\.\d+)?)S)?)?$/u
    .exec(value);
  if (match === null) throw new RangeError("Invalid duration");
  return new globalThis.Temporal.Duration(
    ...match.slice(1).map(part => part === undefined ? 0 : Number(part)),
  );
}

function validateDate(year, month, day) {
  const value = new Date(Date.UTC(year, month - 1, day));
  if (
    value.getUTCFullYear() !== year
    || value.getUTCMonth() + 1 !== month
    || value.getUTCDate() !== day
  ) throw new RangeError("Invalid ISO date");
}

function bitmapDimension(value, fallback) {
  if (value === undefined) return fallback;
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  const dimension = Math.trunc(number) >>> 0;
  if (dimension > 16384) {
    throw new RangeError("The requested ImageBitmap dimensions are too large.");
  }
  return dimension;
}

function pad2(value) {
  return `${value}`.padStart(2, "0");
}

function padYear(value) {
  return `${value}`.padStart(4, "0");
}
