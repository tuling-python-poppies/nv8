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
} from "../webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../webidl/native-function.js";

const constructors = Object.freeze(Object.fromEntries(
  runtime.fileSystemConstructors.map(Constructor => [Constructor.name, Constructor]),
));

export function installFileSystem() {
  do {
    delete (((runtime.fileSystemConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.fileSystemConstructors)[0])).name, (((runtime.fileSystemConstructors)[0])));
  } while (false);
do {
    delete (((runtime.fileSystemConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.fileSystemConstructors)[1])).name, (((runtime.fileSystemConstructors)[1])));
  } while (false);
do {
    delete (((runtime.fileSystemConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((runtime.fileSystemConstructors)[2])).name, (((runtime.fileSystemConstructors)[2])));
  } while (false);
do {
    delete (((runtime.fileSystemConstructors)[3])).prototype.constructor;
    defineGlobalConstructor((((runtime.fileSystemConstructors)[3])).name, (((runtime.fileSystemConstructors)[3])));
  } while (false);
do {
    delete (((runtime.fileSystemConstructors)[4])).prototype.constructor;
    defineGlobalConstructor((((runtime.fileSystemConstructors)[4])).name, (((runtime.fileSystemConstructors)[4])));
  } while (false);
do {
    delete (((runtime.fileSystemConstructors)[5])).prototype.constructor;
    defineGlobalConstructor((((runtime.fileSystemConstructors)[5])).name, (((runtime.fileSystemConstructors)[5])));
  } while (false);
do {
    delete (((runtime.fileSystemConstructors)[6])).prototype.constructor;
    defineGlobalConstructor((((runtime.fileSystemConstructors)[6])).name, (((runtime.fileSystemConstructors)[6])));
  } while (false);
do {
    delete (((runtime.fileSystemConstructors)[7])).prototype.constructor;
    defineGlobalConstructor((((runtime.fileSystemConstructors)[7])).name, (((runtime.fileSystemConstructors)[7])));
  } while (false);
  do {
    const Constructor = constructors[("StorageManager")];
    const parent = constructors[(((((Object.entries(FILE_SYSTEM_SURFACES))[0]))[1])).prototypeParent]
      ?? ((((((Object.entries(FILE_SYSTEM_SURFACES))[0]))[1])).prototypeParent === "WritableStream" ? WritableStream : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("FileSystemDirectoryHandle")];
    const parent = constructors[(((((Object.entries(FILE_SYSTEM_SURFACES))[1]))[1])).prototypeParent]
      ?? ((((((Object.entries(FILE_SYSTEM_SURFACES))[1]))[1])).prototypeParent === "WritableStream" ? WritableStream : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("FileSystemFileHandle")];
    const parent = constructors[(((((Object.entries(FILE_SYSTEM_SURFACES))[2]))[1])).prototypeParent]
      ?? ((((((Object.entries(FILE_SYSTEM_SURFACES))[2]))[1])).prototypeParent === "WritableStream" ? WritableStream : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("FileSystemHandle")];
    const parent = constructors[(((((Object.entries(FILE_SYSTEM_SURFACES))[3]))[1])).prototypeParent]
      ?? ((((((Object.entries(FILE_SYSTEM_SURFACES))[3]))[1])).prototypeParent === "WritableStream" ? WritableStream : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("FileSystemWritableFileStream")];
    const parent = constructors[(((((Object.entries(FILE_SYSTEM_SURFACES))[4]))[1])).prototypeParent]
      ?? ((((((Object.entries(FILE_SYSTEM_SURFACES))[4]))[1])).prototypeParent === "WritableStream" ? WritableStream : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("FileSystemObserver")];
    const parent = constructors[(((((Object.entries(FILE_SYSTEM_SURFACES))[5]))[1])).prototypeParent]
      ?? ((((((Object.entries(FILE_SYSTEM_SURFACES))[5]))[1])).prototypeParent === "WritableStream" ? WritableStream : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("StorageBucket")];
    const parent = constructors[(((((Object.entries(FILE_SYSTEM_SURFACES))[6]))[1])).prototypeParent]
      ?? ((((((Object.entries(FILE_SYSTEM_SURFACES))[6]))[1])).prototypeParent === "WritableStream" ? WritableStream : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("StorageBucketManager")];
    const parent = constructors[(((((Object.entries(FILE_SYSTEM_SURFACES))[7]))[1])).prototypeParent]
      ?? ((((((Object.entries(FILE_SYSTEM_SURFACES))[7]))[1])).prototypeParent === "WritableStream" ? WritableStream : null);
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
  do {
    {
  do {
    method((constructors[("StorageManager")]), ("estimate"), (0));
  } while (false);
do {
    method((constructors[("StorageManager")]), ("persisted"), (0));
  } while (false);
do {
    defineConstructorBacklink((constructors[("StorageManager")]).prototype, (constructors[("StorageManager")]));
  } while (false);
do {
    method((constructors[("StorageManager")]), ("getDirectory"), (0));
  } while (false);
do {
    method((constructors[("StorageManager")]), ("persist"), (0));
  } while (false);
do {
    defineToStringTag((constructors[("StorageManager")]).prototype, (constructors[("StorageManager")]).name);
  } while (false);
}
  } while (false);
do {
    {
  do {
    method((constructors[("FileSystemDirectoryHandle")]), ("getDirectoryHandle"), (1));
  } while (false);
do {
    method((constructors[("FileSystemDirectoryHandle")]), ("getFileHandle"), (1));
  } while (false);
do {
    method((constructors[("FileSystemDirectoryHandle")]), ("removeEntry"), (1));
  } while (false);
do {
    method((constructors[("FileSystemDirectoryHandle")]), ("resolve"), (1));
  } while (false);
do {
    method((constructors[("FileSystemDirectoryHandle")]), ("entries"), (0));
  } while (false);
do {
    method((constructors[("FileSystemDirectoryHandle")]), ("keys"), (0));
  } while (false);
do {
    method((constructors[("FileSystemDirectoryHandle")]), ("values"), (0));
  } while (false);
do {
    defineConstructorBacklink((constructors[("FileSystemDirectoryHandle")]).prototype, (constructors[("FileSystemDirectoryHandle")]));
  } while (false);
do {
    defineToStringTag((constructors[("FileSystemDirectoryHandle")]).prototype, (constructors[("FileSystemDirectoryHandle")]).name);
  } while (false);
do {
    {
      function entries() {
        return runtime.fileSystemAsyncIterator(this);
      }
      registerNativeFunction(entries, "entries");
      definePrototypeMethod(
        (constructors[("FileSystemDirectoryHandle")]).prototype,
        Symbol.asyncIterator,
        entries,
        "entries",
        false,
      );
    }
  } while (false);
}
  } while (false);
do {
    {
  do {
    method((constructors[("FileSystemFileHandle")]), ("createWritable"), (0));
  } while (false);
do {
    method((constructors[("FileSystemFileHandle")]), ("getFile"), (0));
  } while (false);
do {
    method((constructors[("FileSystemFileHandle")]), ("move"), (1));
  } while (false);
do {
    defineConstructorBacklink((constructors[("FileSystemFileHandle")]).prototype, (constructors[("FileSystemFileHandle")]));
  } while (false);
do {
    defineToStringTag((constructors[("FileSystemFileHandle")]).prototype, (constructors[("FileSystemFileHandle")]).name);
  } while (false);
}
  } while (false);
do {
    {
  do {
    accessor((constructors[("FileSystemHandle")]), ("kind"));
  } while (false);
do {
    accessor((constructors[("FileSystemHandle")]), ("name"));
  } while (false);
do {
    method((constructors[("FileSystemHandle")]), ("isSameEntry"), (1));
  } while (false);
do {
    method((constructors[("FileSystemHandle")]), ("queryPermission"), (0));
  } while (false);
do {
    method((constructors[("FileSystemHandle")]), ("remove"), (0));
  } while (false);
do {
    method((constructors[("FileSystemHandle")]), ("requestPermission"), (0));
  } while (false);
do {
    defineConstructorBacklink((constructors[("FileSystemHandle")]).prototype, (constructors[("FileSystemHandle")]));
  } while (false);
do {
    defineToStringTag((constructors[("FileSystemHandle")]).prototype, (constructors[("FileSystemHandle")]).name);
  } while (false);
}
  } while (false);
do {
    {
  do {
    method((constructors[("FileSystemWritableFileStream")]), ("seek"), (1));
  } while (false);
do {
    method((constructors[("FileSystemWritableFileStream")]), ("truncate"), (1));
  } while (false);
do {
    method((constructors[("FileSystemWritableFileStream")]), ("write"), (1));
  } while (false);
do {
    accessor((constructors[("FileSystemWritableFileStream")]), ("mode"));
  } while (false);
do {
    defineConstructorBacklink((constructors[("FileSystemWritableFileStream")]).prototype, (constructors[("FileSystemWritableFileStream")]));
  } while (false);
do {
    defineToStringTag((constructors[("FileSystemWritableFileStream")]).prototype, (constructors[("FileSystemWritableFileStream")]).name);
  } while (false);
}
  } while (false);
do {
    {
  do {
    method((constructors[("FileSystemObserver")]), ("disconnect"), (0));
  } while (false);
do {
    method((constructors[("FileSystemObserver")]), ("observe"), (1));
  } while (false);
do {
    defineConstructorBacklink((constructors[("FileSystemObserver")]).prototype, (constructors[("FileSystemObserver")]));
  } while (false);
do {
    defineToStringTag((constructors[("FileSystemObserver")]).prototype, (constructors[("FileSystemObserver")]).name);
  } while (false);
}
  } while (false);
do {
    {
  do {
    accessor((constructors[("StorageBucket")]), ("name"));
  } while (false);
do {
    accessor((constructors[("StorageBucket")]), ("indexedDB"));
  } while (false);
do {
    accessor((constructors[("StorageBucket")]), ("caches"));
  } while (false);
do {
    method((constructors[("StorageBucket")]), ("estimate"), (0));
  } while (false);
do {
    method((constructors[("StorageBucket")]), ("expires"), (0));
  } while (false);
do {
    method((constructors[("StorageBucket")]), ("getDirectory"), (0));
  } while (false);
do {
    method((constructors[("StorageBucket")]), ("persisted"), (0));
  } while (false);
do {
    method((constructors[("StorageBucket")]), ("setExpires"), (1));
  } while (false);
do {
    defineConstructorBacklink((constructors[("StorageBucket")]).prototype, (constructors[("StorageBucket")]));
  } while (false);
do {
    method((constructors[("StorageBucket")]), ("persist"), (0));
  } while (false);
do {
    defineToStringTag((constructors[("StorageBucket")]).prototype, (constructors[("StorageBucket")]).name);
  } while (false);
}
  } while (false);
do {
    {
  do {
    method((constructors[("StorageBucketManager")]), ("delete"), (1));
  } while (false);
do {
    method((constructors[("StorageBucketManager")]), ("keys"), (0));
  } while (false);
do {
    method((constructors[("StorageBucketManager")]), ("open"), (1));
  } while (false);
do {
    defineConstructorBacklink((constructors[("StorageBucketManager")]).prototype, (constructors[("StorageBucketManager")]));
  } while (false);
do {
    defineToStringTag((constructors[("StorageBucketManager")]).prototype, (constructors[("StorageBucketManager")]).name);
  } while (false);
}
  } while (false);
  do {
    const callback = {
      [("showDirectoryPicker")]() {
        return runtime.showPicker();
      },
    }[("showDirectoryPicker")];
    registerNativeFunction(callback, ("showDirectoryPicker"));
    defineGlobalFunction(("showDirectoryPicker"), callback);
  } while (false);
do {
    const callback = {
      [("showOpenFilePicker")]() {
        return runtime.showPicker();
      },
    }[("showOpenFilePicker")];
    registerNativeFunction(callback, ("showOpenFilePicker"));
    defineGlobalFunction(("showOpenFilePicker"), callback);
  } while (false);
do {
    const callback = {
      [("showSaveFilePicker")]() {
        return runtime.showPicker();
      },
    }[("showSaveFilePicker")];
    registerNativeFunction(callback, ("showSaveFilePicker"));
    defineGlobalFunction(("showSaveFilePicker"), callback);
  } while (false);
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
