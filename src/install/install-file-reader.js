import { EventTarget } from "../api/event/event-target-constructor.js";
import {
  File,
  FileReader,
  fileProperty,
  installFileInheritance,
  readerAbort,
  readerHandler,
  readerProperty,
  readerReadAsArrayBuffer,
  readerReadAsBinaryString,
  readerReadAsDataURL,
  readerReadAsText,
  setReaderHandler,
} from "../api/file/file-runtime.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../webidl/native-function.js";

export function installFileAndReader() {
  installFileInheritance();
  delete File.prototype.constructor;
  defineGlobalConstructor("File", File);
  do {getter(File, ("name"), fileProperty);} while (false);
do {getter(File, ("lastModified"), fileProperty);} while (false);
do {getter(File, ("lastModifiedDate"), fileProperty);} while (false);
do {getter(File, ("webkitRelativePath"), fileProperty);} while (false);
  finish(File);

  Object.setPrototypeOf(FileReader.prototype, EventTarget.prototype);
  Object.setPrototypeOf(FileReader, EventTarget);
  delete FileReader.prototype.constructor;
  defineGlobalConstructor("FileReader", FileReader);
  do {
    getter(FileReader, ("readyState"), readerProperty);
  } while (false);
do {
    getter(FileReader, ("result"), readerProperty);
  } while (false);
do {
    getter(FileReader, ("error"), readerProperty);
  } while (false);
  do {handler(("onloadstart"));} while (false);
do {handler(("onprogress"));} while (false);
do {handler(("onload"));} while (false);
do {handler(("onabort"));} while (false);
do {handler(("onerror"));} while (false);
do {handler(("onloadend"));} while (false);
  do {
    Object.defineProperty(FileReader.prototype, ("EMPTY"), {
      value: (0),
      writable: false,
      enumerable: true,
      configurable: false,
    });
    Object.defineProperty(FileReader, ("EMPTY"), {
      value: (0),
      writable: false,
      enumerable: true,
      configurable: false,
    });
  } while (false);
do {
    Object.defineProperty(FileReader.prototype, ("LOADING"), {
      value: (1),
      writable: false,
      enumerable: true,
      configurable: false,
    });
    Object.defineProperty(FileReader, ("LOADING"), {
      value: (1),
      writable: false,
      enumerable: true,
      configurable: false,
    });
  } while (false);
do {
    Object.defineProperty(FileReader.prototype, ("DONE"), {
      value: (2),
      writable: false,
      enumerable: true,
      configurable: false,
    });
    Object.defineProperty(FileReader, ("DONE"), {
      value: (2),
      writable: false,
      enumerable: true,
      configurable: false,
    });
  } while (false);
  method(FileReader, "abort", 0, readerAbort);
  method(FileReader, "readAsArrayBuffer", 1, readerReadAsArrayBuffer);
  method(FileReader, "readAsBinaryString", 1, readerReadAsBinaryString);
  method(FileReader, "readAsDataURL", 1, readerReadAsDataURL);
  method(FileReader, "readAsText", 1, readerReadAsText);
  finish(FileReader);
}

function getter(constructor, name, operation) {
  const callback = function () {
    return operation(this, name);
  };
  registerNativeGetter(callback, name);
  definePrototypeGetter(constructor.prototype, name, callback);
}

function handler(name) {
  const getter = function () {
    return readerHandler(this, name);
  };
  registerNativeGetter(getter, name);
  definePrototypeAccessor(FileReader.prototype, name, getter, function (value) {
    setReaderHandler(this, name, value);
  });
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
}

function finish(constructor) {
  defineConstructorBacklink(constructor.prototype, constructor);
  defineToStringTag(constructor.prototype, constructor.name);
}
