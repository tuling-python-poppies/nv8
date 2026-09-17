import { registerNativeFunction } from "../../../engine/webidl/native-function.js";

const readableState = new WeakMap();
const readableControllerState = new WeakMap();
const readerState = new WeakMap();
const byobRequestState = new WeakMap();
const writableState = new WeakMap();
const writableControllerState = new WeakMap();
const writerState = new WeakMap();
const transformState = new WeakMap();
const transformControllerState = new WeakMap();
const internal = Symbol("stream internal");

export function ReadableStream() {
  if (!new.target) throw new TypeError("Constructor ReadableStream requires 'new'");
  initializeReadable(this, arguments[0] ?? {}, arguments[1] ?? {});
}

export function ReadableStreamDefaultController() {
  if (arguments[0] !== internal) throw new TypeError("Illegal constructor");
}

export function ReadableByteStreamController() {
  if (arguments[0] !== internal) throw new TypeError("Illegal constructor");
}

export function ReadableStreamDefaultReader(stream) {
  if (!new.target) throw new TypeError("Constructor requires 'new'");
  initializeReader(this, stream, false);
}

export function ReadableStreamBYOBReader(stream) {
  if (!new.target) throw new TypeError("Constructor requires 'new'");
  initializeReader(this, stream, true);
}

export function ReadableStreamBYOBRequest() {
  if (arguments[0] !== internal) throw new TypeError("Illegal constructor");
}

export function WritableStream() {
  if (!new.target) throw new TypeError("Constructor WritableStream requires 'new'");
  initializeWritable(this, arguments[0] ?? {}, arguments[1] ?? {});
}

export function WritableStreamDefaultController() {
  if (arguments[0] !== internal) throw new TypeError("Illegal constructor");
}

export function WritableStreamDefaultWriter(stream) {
  if (!new.target) throw new TypeError("Constructor requires 'new'");
  initializeWriter(this, stream);
}

export function TransformStream() {
  if (!new.target) throw new TypeError("Constructor TransformStream requires 'new'");
  initializeTransform(this, arguments[0] ?? {});
}

export function TransformStreamDefaultController() {
  if (arguments[0] !== internal) throw new TypeError("Illegal constructor");
}

export const streamConstructors = [
  ReadableStream,
  ReadableStreamDefaultController,
  ReadableByteStreamController,
  ReadableStreamDefaultReader,
  ReadableStreamBYOBReader,
  ReadableStreamBYOBRequest,
  WritableStream,
  WritableStreamDefaultController,
  WritableStreamDefaultWriter,
  TransformStream,
  TransformStreamDefaultController,
];

for (const constructor of streamConstructors) {
  registerNativeFunction(constructor, constructor.name);
}

export function readableLocked(stream) {
  return requireReadable(stream).reader !== null;
}

export function readableCancel(stream, reason) {
  const state = requireReadable(stream);
  if (state.reader !== null) {
    return Promise.reject(new TypeError("Cannot cancel a locked stream"));
  }
  closeReadable(state);
  return Promise.resolve(callOptional(state.source.cancel, state.source, [reason]));
}

export function readableGetReader(stream, options = {}) {
  requireReadable(stream);
  return options?.mode === "byob"
    ? new ReadableStreamBYOBReader(stream)
    : new ReadableStreamDefaultReader(stream);
}

export function readablePipeThrough(stream, transform, options) {
  readablePipeTo(stream, transform?.writable, options).catch(() => {});
  return transform?.readable;
}

export async function readablePipeTo(stream, destination, _options) {
  const reader = readableGetReader(stream);
  const writer = writableGetWriter(destination);
  try {
    while (true) {
      const result = await readerRead(reader);
      if (result.done) break;
      await writerWrite(writer, result.value);
    }
    await writerClose(writer);
  } finally {
    readerReleaseLock(reader);
    writerReleaseLock(writer);
  }
}

export function readableTee(stream) {
  const branches = [null, null];
  let controllers = [];
  branches[0] = new ReadableStream({ start(value) { controllers[0] = value; } });
  branches[1] = new ReadableStream({ start(value) { controllers[1] = value; } });
  (async () => {
    const reader = readableGetReader(stream);
    try {
      while (true) {
        const result = await readerRead(reader);
        if (result.done) {
          controllers.forEach(controllerClose);
          break;
        }
        controllers.forEach(controller => controllerEnqueue(controller, result.value));
      }
    } catch (error) {
      controllers.forEach(controller => controllerError(controller, error));
    } finally {
      readerReleaseLock(reader);
    }
  })();
  return branches;
}

export function readableValues(stream, options = {}) {
  const reader = readableGetReader(stream);
  let finished = false;
  return {
    async next() {
      if (finished) return { value: undefined, done: true };
      const result = await readerRead(reader);
      if (result.done) {
        finished = true;
        readerReleaseLock(reader);
      }
      return result;
    },
    async return(value) {
      if (!finished && !options?.preventCancel) {
        await readerCancel(reader, value);
      }
      finished = true;
      readerReleaseLock(reader);
      return { value, done: true };
    },
    [Symbol.asyncIterator]() { return this; },
  };
}

export function controllerDesiredSize(controller) {
  const state = requireReadableController(controller).streamState;
  return state.closed ? 0 : Math.max(0, 1 - state.queue.length);
}

export function controllerClose(controller) {
  closeReadable(requireReadableController(controller).streamState);
}

export function controllerEnqueue(controller, chunk) {
  const state = requireReadableController(controller).streamState;
  if (state.closed) throw new TypeError("The stream is closed");
  if (state.pending.length > 0) {
    state.pending.shift().resolve({ value: chunk, done: false });
  } else {
    state.queue.push(chunk);
  }
}

export function controllerError(controller, error) {
  errorReadable(requireReadableController(controller).streamState, error);
}

export function byteControllerByobRequest(controller) {
  requireReadableController(controller);
  return null;
}

export function readerRead(reader, view) {
  const record = requireReader(reader);
  if (record.byob && view !== undefined && !ArrayBuffer.isView(view)) {
    return Promise.reject(new TypeError("A view is required"));
  }
  return readFrom(record.streamState).then(result => {
    if (!record.byob || result.done || view === undefined) return result;
    const bytes = ArrayBuffer.isView(result.value)
      ? new Uint8Array(
        result.value.buffer,
        result.value.byteOffset,
        result.value.byteLength,
      )
      : new Uint8Array(result.value);
    const target = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
    const written = Math.min(bytes.byteLength, target.byteLength);
    target.set(bytes.subarray(0, written));
    if (written < bytes.byteLength) {
      record.streamState.queue.unshift(bytes.slice(written));
    }
    return { value: view, done: false };
  });
}

export function readerReleaseLock(reader) {
  const record = requireReader(reader);
  if (record.streamState.pending.length > 0) {
    throw new TypeError("Cannot release a reader with pending reads");
  }
  record.streamState.reader = null;
  record.released = true;
}

export function readerClosed(reader) {
  return requireReader(reader).closed;
}

export function readerCancel(reader, reason) {
  const record = requireReader(reader);
  closeReadable(record.streamState);
  return Promise.resolve(callOptional(
    record.streamState.source.cancel,
    record.streamState.source,
    [reason],
  ));
}

export function byobRequestView(request) {
  return requireBYOBRequest(request).view;
}

export function byobRequestRespond(request, bytesWritten) {
  const record = requireBYOBRequest(request);
  record.bytesWritten = Number(bytesWritten) >>> 0;
}

export function byobRequestRespondWithNewView(request, view) {
  requireBYOBRequest(request).view = view;
}

export function writableLocked(stream) {
  return requireWritable(stream).writer !== null;
}

export function writableAbort(stream, reason) {
  const state = requireWritable(stream);
  return Promise.resolve().then(() => callOptional(state.sink.abort, state.sink, [reason])).then(
    value => { state.closed = true; state.closedResolve?.(); return value; },
    error => { state.closed = true; state.error = error; state.closedReject?.(error); throw error; },
  );
}

export function writableClose(stream) {
  const state = requireWritable(stream);
  if (state.closed) return Promise.reject(new TypeError("The stream is closed"));
  return Promise.resolve().then(() => callOptional(state.sink.close, state.sink, [])).then(
    value => { state.closed = true; state.closedResolve?.(); return value; },
    error => { state.closed = true; state.error = error; state.closedReject?.(error); throw error; },
  );
}

export function writableGetWriter(stream) {
  return new WritableStreamDefaultWriter(stream);
}

export function writableControllerSignal(controller) {
  return requireWritableController(controller).signal;
}

export function writableControllerError(controller, error) {
  const state = requireWritableController(controller).streamState;
  state.error = error;
  state.closed = true;
  state.closedReject?.(error);
}

export function writerClosed(writer) {
  return requireWriter(writer).closed;
}

export function writerDesiredSize(writer) {
  return requireWriter(writer).streamState.closed ? 0 : 1;
}

export function writerReady(writer) {
  requireWriter(writer);
  return Promise.resolve();
}

export function writerAbort(writer, reason) {
  return writableAbort(requireWriter(writer).stream, reason);
}

export function writerClose(writer) {
  return writableClose(requireWriter(writer).stream);
}

export function writerReleaseLock(writer) {
  const record = requireWriter(writer);
  record.streamState.writer = null;
  record.released = true;
}

export function writerWrite(writer, chunk) {
  const record = requireWriter(writer);
  if (record.streamState.closed) {
    return Promise.reject(new TypeError("The stream is closed"));
  }
  return Promise.resolve().then(() => callOptional(
    record.streamState.sink.write,
    record.streamState.sink,
    [chunk, record.streamState.controller],
  ));
}

export function transformReadable(stream) {
  return requireTransform(stream).readable;
}

export function transformWritable(stream) {
  return requireTransform(stream).writable;
}

export function transformDesiredSize(controller) {
  return controllerDesiredSize(requireTransformController(controller).readableController);
}

export function transformEnqueue(controller, chunk) {
  controllerEnqueue(requireTransformController(controller).readableController, chunk);
}

export function transformError(controller, error) {
  const record = requireTransformController(controller);
  controllerError(record.readableController, error);
  writableControllerError(record.writableController, error);
}

export function transformTerminate(controller) {
  const record = requireTransformController(controller);
  controllerClose(record.readableController);
  record.writableState.closed = true;
}

function initializeReadable(stream, source) {
  const byteStream = source?.type === "bytes";
  const controller = Object.create(
    (byteStream ? ReadableByteStreamController : ReadableStreamDefaultController).prototype,
  );
  const state = {
    source,
    queue: [],
    pending: [],
    closed: false,
    error: null,
    closedResolve: null,
    closedReject: null,
    reader: null,
    controller,
  };
  readableState.set(stream, state);
  readableControllerState.set(controller, { streamState: state });
  Promise.resolve(callOptional(source.start, source, [controller]))
    .then(() => pullIfNeeded(state), error => errorReadable(state, error));
}

function initializeReader(reader, stream, byob) {
  const state = requireReadable(stream);
  if (state.reader !== null) throw new TypeError("The stream is locked");
  if (byob && !(state.controller instanceof ReadableByteStreamController)) {
    throw new TypeError("A BYOB reader requires a byte stream");
  }
  const closed = state.closed
    ? Promise.resolve()
    : new Promise((resolve, reject) => {
      state.closedResolve = resolve;
      state.closedReject = reject;
    });
  const record = { stream, streamState: state, byob, closed, released: false };
  readerState.set(reader, record);
  state.reader = reader;
}

function initializeWritable(stream, sink) {
  const controller = Object.create(WritableStreamDefaultController.prototype);
  const state = {
    sink,
    controller,
    writer: null,
    closed: false,
    error: null,
    closedResolve: null,
    closedReject: null,
  };
  writableState.set(stream, state);
  writableControllerState.set(controller, {
    streamState: state,
    signal: new AbortController().signal,
  });
  callOptional(sink.start, sink, [controller]);
}

function initializeWriter(writer, stream) {
  const state = requireWritable(stream);
  if (state.writer !== null) throw new TypeError("The stream is locked");
  const record = {
    stream,
    streamState: state,
    closed: state.closed
      ? Promise.resolve()
      : new Promise((resolve, reject) => {
        state.closedResolve = resolve;
        state.closedReject = reject;
      }),
    released: false,
  };
  writerState.set(writer, record);
  state.writer = writer;
}

function initializeTransform(stream, transformer) {
  let readableController;
  let writableController;
  const readable = new ReadableStream({
    start(controller) { readableController = controller; },
  });
  const transformController = Object.create(TransformStreamDefaultController.prototype);
  const writable = new WritableStream({
    start(controller) { writableController = controller; },
    transform: null,
    write(chunk) {
      if (typeof transformer.transform === "function") {
        return transformer.transform(chunk, transformController);
      }
      transformEnqueue(transformController, chunk);
      return undefined;
    },
    close() {
      const result = callOptional(
        transformer.flush,
        transformer,
        [transformController],
      );
      return Promise.resolve(result).then(() => controllerClose(readableController));
    },
    abort(reason) {
      transformError(transformController, reason);
    },
  });
  const writableRecord = requireWritable(writable);
  transformState.set(stream, { readable, writable });
  transformControllerState.set(transformController, {
    readableController,
    writableController,
    writableState: writableRecord,
  });
  callOptional(transformer.start, transformer, [transformController]);
}

function readFrom(state) {
  if (state.queue.length > 0) {
    const value = state.queue.shift();
    pullIfNeeded(state);
    return Promise.resolve({ value, done: false });
  }
  if (state.error !== null) return Promise.reject(state.error);
  if (state.closed) return Promise.resolve({ value: undefined, done: true });
  const pending = new Promise((resolve, reject) => {
    state.pending.push({ resolve, reject });
  });
  pullIfNeeded(state);
  return pending;
}

function pullIfNeeded(state) {
  if (!state.closed && state.pending.length > 0 && typeof state.source.pull === "function") {
    Promise.resolve(state.source.pull(state.controller))
      .catch(error => errorReadable(state, error));
  }
}

function closeReadable(state) {
  if (state.closed) return;
  state.closed = true;
  while (state.pending.length > 0) {
    state.pending.shift().resolve({ value: undefined, done: true });
  }
  state.closedResolve?.();
}

function errorReadable(state, error) {
  state.error = error;
  state.closed = true;
  while (state.pending.length > 0) state.pending.shift().reject(error);
  state.closedReject?.(error);
}

function requireReadable(value) {
  const state = readableState.get(value);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

function requireReadableController(value) {
  const state = readableControllerState.get(value);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

function requireReader(value) {
  const state = readerState.get(value);
  if (state === undefined || state.released) throw new TypeError("Illegal invocation");
  return state;
}

function requireBYOBRequest(value) {
  const state = byobRequestState.get(value);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

function requireWritable(value) {
  const state = writableState.get(value);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

function requireWritableController(value) {
  const state = writableControllerState.get(value);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

function requireWriter(value) {
  const state = writerState.get(value);
  if (state === undefined || state.released) throw new TypeError("Illegal invocation");
  return state;
}

function requireTransform(value) {
  const state = transformState.get(value);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

function requireTransformController(value) {
  const state = transformControllerState.get(value);
  if (state === undefined) throw new TypeError("Illegal invocation");
  return state;
}

function callOptional(callback, receiver, args) {
  return typeof callback === "function"
    ? Reflect.apply(callback, receiver, args)
    : undefined;
}
