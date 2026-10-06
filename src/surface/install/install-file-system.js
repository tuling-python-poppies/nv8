import { WritableStream } from "../api/streams/stream-runtime.js";
import * as runtime from "../api/file-system/file-system-runtime.js";
import { FILE_SYSTEM_SURFACES } from "../api/file-system/file-system-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  defineGlobalFunction,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

const constructors = Object.freeze(Object.fromEntries(
  runtime.fileSystemConstructors.map(Constructor => [Constructor.name, Constructor]),
));

export function installFileSystem() {

    delete runtime.fileSystemConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.fileSystemConstructors[0].name, runtime.fileSystemConstructors[0]);

    delete runtime.fileSystemConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.fileSystemConstructors[1].name, runtime.fileSystemConstructors[1]);

    delete runtime.fileSystemConstructors[2].prototype.constructor;
    defineGlobalConstructor(runtime.fileSystemConstructors[2].name, runtime.fileSystemConstructors[2]);

    delete runtime.fileSystemConstructors[3].prototype.constructor;
    defineGlobalConstructor(runtime.fileSystemConstructors[3].name, runtime.fileSystemConstructors[3]);

    delete runtime.fileSystemConstructors[4].prototype.constructor;
    defineGlobalConstructor(runtime.fileSystemConstructors[4].name, runtime.fileSystemConstructors[4]);

    delete runtime.fileSystemConstructors[5].prototype.constructor;
    defineGlobalConstructor(runtime.fileSystemConstructors[5].name, runtime.fileSystemConstructors[5]);

    delete runtime.fileSystemConstructors[6].prototype.constructor;
    defineGlobalConstructor(runtime.fileSystemConstructors[6].name, runtime.fileSystemConstructors[6]);

    delete runtime.fileSystemConstructors[7].prototype.constructor;
    defineGlobalConstructor(runtime.fileSystemConstructors[7].name, runtime.fileSystemConstructors[7]);

  {
    const Constructor = constructors["StorageManager"];
    const parent = constructors[(((((Object.entries(FILE_SYSTEM_SURFACES))[0]))[1])).prototypeParent]
      ?? ((((((Object.entries(FILE_SYSTEM_SURFACES))[0]))[1])).prototypeParent === "WritableStream" ? WritableStream : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["FileSystemDirectoryHandle"];
    const parent = constructors[(((((Object.entries(FILE_SYSTEM_SURFACES))[1]))[1])).prototypeParent]
      ?? ((((((Object.entries(FILE_SYSTEM_SURFACES))[1]))[1])).prototypeParent === "WritableStream" ? WritableStream : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["FileSystemFileHandle"];
    const parent = constructors[(((((Object.entries(FILE_SYSTEM_SURFACES))[2]))[1])).prototypeParent]
      ?? ((((((Object.entries(FILE_SYSTEM_SURFACES))[2]))[1])).prototypeParent === "WritableStream" ? WritableStream : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["FileSystemHandle"];
    const parent = constructors[(((((Object.entries(FILE_SYSTEM_SURFACES))[3]))[1])).prototypeParent]
      ?? ((((((Object.entries(FILE_SYSTEM_SURFACES))[3]))[1])).prototypeParent === "WritableStream" ? WritableStream : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["FileSystemWritableFileStream"];
    const parent = constructors[(((((Object.entries(FILE_SYSTEM_SURFACES))[4]))[1])).prototypeParent]
      ?? ((((((Object.entries(FILE_SYSTEM_SURFACES))[4]))[1])).prototypeParent === "WritableStream" ? WritableStream : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["FileSystemObserver"];
    const parent = constructors[(((((Object.entries(FILE_SYSTEM_SURFACES))[5]))[1])).prototypeParent]
      ?? ((((((Object.entries(FILE_SYSTEM_SURFACES))[5]))[1])).prototypeParent === "WritableStream" ? WritableStream : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["StorageBucket"];
    const parent = constructors[(((((Object.entries(FILE_SYSTEM_SURFACES))[6]))[1])).prototypeParent]
      ?? ((((((Object.entries(FILE_SYSTEM_SURFACES))[6]))[1])).prototypeParent === "WritableStream" ? WritableStream : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["StorageBucketManager"];
    const parent = constructors[(((((Object.entries(FILE_SYSTEM_SURFACES))[7]))[1])).prototypeParent]
      ?? ((((((Object.entries(FILE_SYSTEM_SURFACES))[7]))[1])).prototypeParent === "WritableStream" ? WritableStream : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }

    {

    method(constructors["StorageManager"], "estimate", 0);

    method(constructors["StorageManager"], "persisted", 0);

    defineConstructorBacklink(constructors["StorageManager"].prototype, constructors["StorageManager"]);

    method(constructors["StorageManager"], "getDirectory", 0);

    method(constructors["StorageManager"], "persist", 0);

    defineToStringTag(constructors["StorageManager"].prototype, constructors["StorageManager"].name);

}

{

    method(constructors["FileSystemDirectoryHandle"], "getDirectoryHandle", 1);

    method(constructors["FileSystemDirectoryHandle"], "getFileHandle", 1);

    method(constructors["FileSystemDirectoryHandle"], "removeEntry", 1);

    method(constructors["FileSystemDirectoryHandle"], "resolve", 1);

    method(constructors["FileSystemDirectoryHandle"], "entries", 0);

    method(constructors["FileSystemDirectoryHandle"], "keys", 0);

    method(constructors["FileSystemDirectoryHandle"], "values", 0);

    defineConstructorBacklink(constructors["FileSystemDirectoryHandle"].prototype, constructors["FileSystemDirectoryHandle"]);

    defineToStringTag(constructors["FileSystemDirectoryHandle"].prototype, constructors["FileSystemDirectoryHandle"].name);

{
      function entries() {
        return runtime.fileSystemAsyncIterator(this);
      }
      registerNativeFunction(entries, "entries");
      definePrototypeMethod(
        (constructors["FileSystemDirectoryHandle"]).prototype,
        Symbol.asyncIterator,
        entries,
        "entries",
        false,
      );
    }
}

    {

    method(constructors["FileSystemFileHandle"], "createWritable", 0);

    method(constructors["FileSystemFileHandle"], "getFile", 0);

    method(constructors["FileSystemFileHandle"], "move", 1);

    defineConstructorBacklink(constructors["FileSystemFileHandle"].prototype, constructors["FileSystemFileHandle"]);

    defineToStringTag(constructors["FileSystemFileHandle"].prototype, constructors["FileSystemFileHandle"].name);

}

    {

    accessor(constructors["FileSystemHandle"], "kind");

    accessor(constructors["FileSystemHandle"], "name");

    method(constructors["FileSystemHandle"], "isSameEntry", 1);

    method(constructors["FileSystemHandle"], "queryPermission", 0);

    method(constructors["FileSystemHandle"], "remove", 0);

    method(constructors["FileSystemHandle"], "requestPermission", 0);

    defineConstructorBacklink(constructors["FileSystemHandle"].prototype, constructors["FileSystemHandle"]);

    defineToStringTag(constructors["FileSystemHandle"].prototype, constructors["FileSystemHandle"].name);

}

    {

    method(constructors["FileSystemWritableFileStream"], "seek", 1);

    method(constructors["FileSystemWritableFileStream"], "truncate", 1);

    method(constructors["FileSystemWritableFileStream"], "write", 1);

    accessor(constructors["FileSystemWritableFileStream"], "mode");

    defineConstructorBacklink(constructors["FileSystemWritableFileStream"].prototype, constructors["FileSystemWritableFileStream"]);

    defineToStringTag(constructors["FileSystemWritableFileStream"].prototype, constructors["FileSystemWritableFileStream"].name);

}

    {

    method(constructors["FileSystemObserver"], "disconnect", 0);

    method(constructors["FileSystemObserver"], "observe", 1);

    defineConstructorBacklink(constructors["FileSystemObserver"].prototype, constructors["FileSystemObserver"]);

    defineToStringTag(constructors["FileSystemObserver"].prototype, constructors["FileSystemObserver"].name);

}

    {

    accessor(constructors["StorageBucket"], "name");

    accessor(constructors["StorageBucket"], "indexedDB");

    accessor(constructors["StorageBucket"], "caches");

    method(constructors["StorageBucket"], "estimate", 0);

    method(constructors["StorageBucket"], "expires", 0);

    method(constructors["StorageBucket"], "getDirectory", 0);

    method(constructors["StorageBucket"], "persisted", 0);

    method(constructors["StorageBucket"], "setExpires", 1);

    defineConstructorBacklink(constructors["StorageBucket"].prototype, constructors["StorageBucket"]);

    method(constructors["StorageBucket"], "persist", 0);

    defineToStringTag(constructors["StorageBucket"].prototype, constructors["StorageBucket"].name);

}

    {

    method(constructors["StorageBucketManager"], "delete", 1);

    method(constructors["StorageBucketManager"], "keys", 0);

    method(constructors["StorageBucketManager"], "open", 1);

    defineConstructorBacklink(constructors["StorageBucketManager"].prototype, constructors["StorageBucketManager"]);

    defineToStringTag(constructors["StorageBucketManager"].prototype, constructors["StorageBucketManager"].name);

}

  {
    const callback = {
      ["showDirectoryPicker"]() {
        return runtime.showPicker();
      },
    }["showDirectoryPicker"];
    registerNativeFunction(callback, "showDirectoryPicker");
    defineGlobalFunction("showDirectoryPicker", callback);
  }
{
    const callback = {
      ["showOpenFilePicker"]() {
        return runtime.showPicker();
      },
    }["showOpenFilePicker"];
    registerNativeFunction(callback, "showOpenFilePicker");
    defineGlobalFunction("showOpenFilePicker", callback);
  }
{
    const callback = {
      ["showSaveFilePicker"]() {
        return runtime.showPicker();
      },
    }["showSaveFilePicker"];
    registerNativeFunction(callback, "showSaveFilePicker");
    defineGlobalFunction("showSaveFilePicker", callback);
  }
}

function accessor(Constructor, name) {
  const getter = Object.getOwnPropertyDescriptor({
    get [name]() {
      return runtime.fileSystemProperty(this, name);
    },
  }, name).get;
  registerNativeGetter(getter, name);
  definePrototypeGetter(Constructor.prototype, name, getter);
}

function method(Constructor, name, length) {
  const callback = {
    [name](...args) {
      return runtime.fileSystemOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", { value: length, configurable: true });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}
