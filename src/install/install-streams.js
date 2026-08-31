import {
  ReadableByteStreamController,
  ReadableStream,
  ReadableStreamBYOBReader,
  ReadableStreamBYOBRequest,
  ReadableStreamDefaultController,
  ReadableStreamDefaultReader,
  TransformStream,
  TransformStreamDefaultController,
  WritableStream,
  WritableStreamDefaultController,
  WritableStreamDefaultWriter,
  byobRequestRespond,
  byobRequestRespondWithNewView,
  byobRequestView,
  byteControllerByobRequest,
  controllerClose,
  controllerDesiredSize,
  controllerEnqueue,
  controllerError,
  readableCancel,
  readableGetReader,
  readableLocked,
  readablePipeThrough,
  readablePipeTo,
  readableTee,
  readableValues,
  readerCancel,
  readerClosed,
  readerRead,
  readerReleaseLock,
  streamConstructors,
  transformDesiredSize,
  transformEnqueue,
  transformError,
  transformReadable,
  transformTerminate,
  transformWritable,
  writableAbort,
  writableClose,
  writableControllerError,
  writableControllerSignal,
  writableGetWriter,
  writableLocked,
  writerAbort,
  writerClose,
  writerClosed,
  writerDesiredSize,
  writerReady,
  writerReleaseLock,
  writerWrite,
} from "../api/streams/stream-runtime.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../webidl/native-function.js";

export function installStreams() {
  do {
    delete (((streamConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((streamConstructors)[0])).name, (((streamConstructors)[0])));
  } while (false);
do {
    delete (((streamConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((streamConstructors)[1])).name, (((streamConstructors)[1])));
  } while (false);
do {
    delete (((streamConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((streamConstructors)[2])).name, (((streamConstructors)[2])));
  } while (false);
do {
    delete (((streamConstructors)[3])).prototype.constructor;
    defineGlobalConstructor((((streamConstructors)[3])).name, (((streamConstructors)[3])));
  } while (false);
do {
    delete (((streamConstructors)[4])).prototype.constructor;
    defineGlobalConstructor((((streamConstructors)[4])).name, (((streamConstructors)[4])));
  } while (false);
do {
    delete (((streamConstructors)[5])).prototype.constructor;
    defineGlobalConstructor((((streamConstructors)[5])).name, (((streamConstructors)[5])));
  } while (false);
do {
    delete (((streamConstructors)[6])).prototype.constructor;
    defineGlobalConstructor((((streamConstructors)[6])).name, (((streamConstructors)[6])));
  } while (false);
do {
    delete (((streamConstructors)[7])).prototype.constructor;
    defineGlobalConstructor((((streamConstructors)[7])).name, (((streamConstructors)[7])));
  } while (false);
do {
    delete (((streamConstructors)[8])).prototype.constructor;
    defineGlobalConstructor((((streamConstructors)[8])).name, (((streamConstructors)[8])));
  } while (false);
do {
    delete (((streamConstructors)[9])).prototype.constructor;
    defineGlobalConstructor((((streamConstructors)[9])).name, (((streamConstructors)[9])));
  } while (false);
do {
    delete (((streamConstructors)[10])).prototype.constructor;
    defineGlobalConstructor((((streamConstructors)[10])).name, (((streamConstructors)[10])));
  } while (false);
  installReadableStream();
  installDefaultController();
  installByteController();
  installDefaultReader();
  installBYOBReader();
  installBYOBRequest();
  installWritableStream();
  installWritableController();
  installWriter();
  installTransformStream();
  installTransformController();
}

function installReadableStream() {
  getter(ReadableStream, "locked", readableLocked);
  method(ReadableStream, "cancel", 0, readableCancel);
  method(ReadableStream, "getReader", 0, readableGetReader);
  method(ReadableStream, "pipeThrough", 1, readablePipeThrough);
  method(ReadableStream, "pipeTo", 1, readablePipeTo);
  method(ReadableStream, "tee", 0, readableTee);
  const values = method(ReadableStream, "values", 0, readableValues);
  finish(ReadableStream);
  Object.defineProperty(ReadableStream.prototype, Symbol.asyncIterator, {
    value: values,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

function installDefaultController() {
  getter(ReadableStreamDefaultController, "desiredSize", controllerDesiredSize);
  method(ReadableStreamDefaultController, "close", 0, controllerClose);
  method(ReadableStreamDefaultController, "enqueue", 0, controllerEnqueue);
  method(ReadableStreamDefaultController, "error", 0, controllerError);
  finish(ReadableStreamDefaultController);
}

function installByteController() {
  getter(ReadableByteStreamController, "byobRequest", byteControllerByobRequest);
  getter(ReadableByteStreamController, "desiredSize", controllerDesiredSize);
  method(ReadableByteStreamController, "close", 0, controllerClose);
  method(ReadableByteStreamController, "enqueue", 1, controllerEnqueue);
  method(ReadableByteStreamController, "error", 0, controllerError);
  finish(ReadableByteStreamController);
}

function installDefaultReader() {
  method(ReadableStreamDefaultReader, "read", 0, readerRead);
  method(ReadableStreamDefaultReader, "releaseLock", 0, readerReleaseLock);
  defineConstructorBacklink(
    ReadableStreamDefaultReader.prototype,
    ReadableStreamDefaultReader,
  );
  getter(ReadableStreamDefaultReader, "closed", readerClosed);
  method(ReadableStreamDefaultReader, "cancel", 0, readerCancel);
  defineToStringTag(
    ReadableStreamDefaultReader.prototype,
    "ReadableStreamDefaultReader",
  );
}

function installBYOBReader() {
  method(ReadableStreamBYOBReader, "read", 1, readerRead);
  method(ReadableStreamBYOBReader, "releaseLock", 0, readerReleaseLock);
  defineConstructorBacklink(
    ReadableStreamBYOBReader.prototype,
    ReadableStreamBYOBReader,
  );
  getter(ReadableStreamBYOBReader, "closed", readerClosed);
  method(ReadableStreamBYOBReader, "cancel", 0, readerCancel);
  defineToStringTag(ReadableStreamBYOBReader.prototype, "ReadableStreamBYOBReader");
}

function installBYOBRequest() {
  getter(ReadableStreamBYOBRequest, "view", byobRequestView);
  method(ReadableStreamBYOBRequest, "respond", 1, byobRequestRespond);
  method(
    ReadableStreamBYOBRequest,
    "respondWithNewView",
    1,
    byobRequestRespondWithNewView,
  );
  finish(ReadableStreamBYOBRequest);
}

function installWritableStream() {
  getter(WritableStream, "locked", writableLocked);
  method(WritableStream, "abort", 0, writableAbort);
  method(WritableStream, "close", 0, writableClose);
  method(WritableStream, "getWriter", 0, writableGetWriter);
  finish(WritableStream);
}

function installWritableController() {
  getter(WritableStreamDefaultController, "signal", writableControllerSignal);
  method(WritableStreamDefaultController, "error", 0, writableControllerError);
  finish(WritableStreamDefaultController);
}

function installWriter() {
  getter(WritableStreamDefaultWriter, "closed", writerClosed);
  getter(WritableStreamDefaultWriter, "desiredSize", writerDesiredSize);
  getter(WritableStreamDefaultWriter, "ready", writerReady);
  method(WritableStreamDefaultWriter, "abort", 0, writerAbort);
  method(WritableStreamDefaultWriter, "close", 0, writerClose);
  method(WritableStreamDefaultWriter, "releaseLock", 0, writerReleaseLock);
  method(WritableStreamDefaultWriter, "write", 0, writerWrite);
  finish(WritableStreamDefaultWriter);
}

function installTransformStream() {
  getter(TransformStream, "readable", transformReadable);
  getter(TransformStream, "writable", transformWritable);
  finish(TransformStream);
}

function installTransformController() {
  getter(TransformStreamDefaultController, "desiredSize", transformDesiredSize);
  method(TransformStreamDefaultController, "enqueue", 0, transformEnqueue);
  method(TransformStreamDefaultController, "error", 0, transformError);
  method(TransformStreamDefaultController, "terminate", 0, transformTerminate);
  finish(TransformStreamDefaultController);
}

function getter(constructor, name, operation) {
  const callback = function () {
    return operation(this);
  };
  registerNativeGetter(callback, name);
  definePrototypeGetter(constructor.prototype, name, callback);
}

function method(constructor, name, length, operation) {
  const callback = {
    [name](...args) {
      return operation(this, ...args);
    },
  }[name];
  Object.defineProperty(callback, "length", { value: length, configurable: true });
  registerNativeFunction(callback, name);
  definePrototypeMethod(constructor.prototype, name, callback);
  return callback;
}

function finish(constructor) {
  defineConstructorBacklink(constructor.prototype, constructor);
  defineToStringTag(constructor.prototype, constructor.name);
}
