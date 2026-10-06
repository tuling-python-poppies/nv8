import { EventTarget } from "../api/event/event-target-constructor.js";
import * as runtime from "../api/indexed-db/indexed-db-runtime.js";
import {
  INDEXED_DB_SURFACES,
} from "../api/indexed-db/indexed-db-surface.js";
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

const constructors = Object.freeze(Object.fromEntries(
  runtime.indexedDBConstructors.map(Constructor => [
    Constructor.name,
    Constructor,
  ]),
));
const eventHandlers = new Set([
  "onabort",
  "onblocked",
  "onclose",
  "oncomplete",
  "onerror",
  "onsuccess",
  "onupgradeneeded",
  "onversionchange",
]);

export function installIndexedDB() {

    delete runtime.indexedDBConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.indexedDBConstructors[0].name, runtime.indexedDBConstructors[0]);

    delete runtime.indexedDBConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.indexedDBConstructors[1].name, runtime.indexedDBConstructors[1]);

    delete runtime.indexedDBConstructors[2].prototype.constructor;
    defineGlobalConstructor(runtime.indexedDBConstructors[2].name, runtime.indexedDBConstructors[2]);

    delete runtime.indexedDBConstructors[3].prototype.constructor;
    defineGlobalConstructor(runtime.indexedDBConstructors[3].name, runtime.indexedDBConstructors[3]);

    delete runtime.indexedDBConstructors[4].prototype.constructor;
    defineGlobalConstructor(runtime.indexedDBConstructors[4].name, runtime.indexedDBConstructors[4]);

    delete runtime.indexedDBConstructors[5].prototype.constructor;
    defineGlobalConstructor(runtime.indexedDBConstructors[5].name, runtime.indexedDBConstructors[5]);

    delete runtime.indexedDBConstructors[6].prototype.constructor;
    defineGlobalConstructor(runtime.indexedDBConstructors[6].name, runtime.indexedDBConstructors[6]);

    delete runtime.indexedDBConstructors[7].prototype.constructor;
    defineGlobalConstructor(runtime.indexedDBConstructors[7].name, runtime.indexedDBConstructors[7]);

    delete runtime.indexedDBConstructors[8].prototype.constructor;
    defineGlobalConstructor(runtime.indexedDBConstructors[8].name, runtime.indexedDBConstructors[8]);

    delete runtime.indexedDBConstructors[9].prototype.constructor;
    defineGlobalConstructor(runtime.indexedDBConstructors[9].name, runtime.indexedDBConstructors[9]);

    delete runtime.indexedDBConstructors[10].prototype.constructor;
    defineGlobalConstructor(runtime.indexedDBConstructors[10].name, runtime.indexedDBConstructors[10]);

  {
    const Constructor = constructors["IDBFactory"];

    {

    installMethod(Constructor, "cmp", 2);

    installMethod(Constructor, "databases", 0);

    installMethod(Constructor, "deleteDatabase", 1);

    installMethod(Constructor, "open", 1);

    {
      defineConstructorBacklink(Constructor.prototype, Constructor);
    }

    {
      defineToStringTag(Constructor.prototype, Constructor.name);
    }

}
  }
{
    const Constructor = constructors["IDBDatabase"];
    {
      inherit(Constructor, EventTarget);
    }
    {

    installAccessor(Constructor, "name");

    installAccessor(Constructor, "version");

    installAccessor(Constructor, "objectStoreNames");

    installAccessor(Constructor, "onabort");

    installAccessor(Constructor, "onclose");

    installAccessor(Constructor, "onerror");

    installAccessor(Constructor, "onversionchange");

    installMethod(Constructor, "close", 0);

    installMethod(Constructor, "createObjectStore", 1);

    installMethod(Constructor, "deleteObjectStore", 1);

    installMethod(Constructor, "transaction", 1);

    {
      defineConstructorBacklink(Constructor.prototype, Constructor);
    }

    {
      defineToStringTag(Constructor.prototype, Constructor.name);
    }

}
  }
{
    const Constructor = constructors["IDBTransaction"];
    {
      inherit(Constructor, EventTarget);
    }
    {

    installAccessor(Constructor, "objectStoreNames");

    installAccessor(Constructor, "mode");

    installAccessor(Constructor, "durability");

    installAccessor(Constructor, "db");

    installAccessor(Constructor, "error");

    installAccessor(Constructor, "onabort");

    installAccessor(Constructor, "oncomplete");

    installAccessor(Constructor, "onerror");

    installMethod(Constructor, "abort", 0);

    installMethod(Constructor, "commit", 0);

    installMethod(Constructor, "objectStore", 1);

    {
      defineConstructorBacklink(Constructor.prototype, Constructor);
    }

    {
      defineToStringTag(Constructor.prototype, Constructor.name);
    }

}
  }
{
    const Constructor = constructors["IDBRequest"];
    {
      inherit(Constructor, EventTarget);
    }
    {

    installAccessor(Constructor, "result");

    installAccessor(Constructor, "error");

    installAccessor(Constructor, "source");

    installAccessor(Constructor, "transaction");

    installAccessor(Constructor, "readyState");

    installAccessor(Constructor, "onsuccess");

    installAccessor(Constructor, "onerror");

    {
      defineConstructorBacklink(Constructor.prototype, Constructor);
    }

    {
      defineToStringTag(Constructor.prototype, Constructor.name);
    }

}
  }
{
    const Constructor = constructors["IDBOpenDBRequest"];
    {
      inherit(Constructor, runtime.IDBRequest);
    }
    {

    installAccessor(Constructor, "onblocked");

    installAccessor(Constructor, "onupgradeneeded");

    {
      defineConstructorBacklink(Constructor.prototype, Constructor);
    }

    {
      defineToStringTag(Constructor.prototype, Constructor.name);
    }

}
  }
{
    const Constructor = constructors["IDBObjectStore"];

    {

    installAccessor(Constructor, "name");

    installAccessor(Constructor, "keyPath");

    installAccessor(Constructor, "indexNames");

    installAccessor(Constructor, "transaction");

    installAccessor(Constructor, "autoIncrement");

    installMethod(Constructor, "add", 1);

    installMethod(Constructor, "clear", 0);

    installMethod(Constructor, "count", 0);

    installMethod(Constructor, "createIndex", 2);

    installMethod(Constructor, "delete", 1);

    installMethod(Constructor, "deleteIndex", 1);

    installMethod(Constructor, "get", 1);

    installMethod(Constructor, "getAll", 0);

    installMethod(Constructor, "getAllKeys", 0);

    installMethod(Constructor, "getAllRecords", 0);

    installMethod(Constructor, "getKey", 1);

    installMethod(Constructor, "index", 1);

    installMethod(Constructor, "openCursor", 0);

    installMethod(Constructor, "openKeyCursor", 0);

    installMethod(Constructor, "put", 1);

    {
      defineConstructorBacklink(Constructor.prototype, Constructor);
    }

    {
      defineToStringTag(Constructor.prototype, Constructor.name);
    }

}
  }
{
    const Constructor = constructors["IDBIndex"];

    {

    installAccessor(Constructor, "name");

    installAccessor(Constructor, "objectStore");

    installAccessor(Constructor, "keyPath");

    installAccessor(Constructor, "multiEntry");

    installAccessor(Constructor, "unique");

    installMethod(Constructor, "count", 0);

    installMethod(Constructor, "get", 1);

    installMethod(Constructor, "getAll", 0);

    installMethod(Constructor, "getAllKeys", 0);

    installMethod(Constructor, "getAllRecords", 0);

    installMethod(Constructor, "getKey", 1);

    installMethod(Constructor, "openCursor", 0);

    installMethod(Constructor, "openKeyCursor", 0);

    {
      defineConstructorBacklink(Constructor.prototype, Constructor);
    }

    {
      defineToStringTag(Constructor.prototype, Constructor.name);
    }

}
  }
{
    const Constructor = constructors["IDBCursor"];

    {

    installAccessor(Constructor, "source");

    installAccessor(Constructor, "direction");

    installAccessor(Constructor, "key");

    installAccessor(Constructor, "primaryKey");

    installAccessor(Constructor, "request");

    installMethod(Constructor, "advance", 1);

    installMethod(Constructor, "continue", 0);

    installMethod(Constructor, "continuePrimaryKey", 2);

    installMethod(Constructor, "delete", 0);

    installMethod(Constructor, "update", 1);

    {
      defineConstructorBacklink(Constructor.prototype, Constructor);
    }

    {
      defineToStringTag(Constructor.prototype, Constructor.name);
    }

}
  }
{
    const Constructor = constructors["IDBCursorWithValue"];
    {
      inherit(Constructor, runtime.IDBCursor);
    }
    {

    installAccessor(Constructor, "value");

    {
      defineConstructorBacklink(Constructor.prototype, Constructor);
    }

    {
      defineToStringTag(Constructor.prototype, Constructor.name);
    }

}
  }
{
    const Constructor = constructors["IDBKeyRange"];

    {

    installAccessor(Constructor, "lower");

    installAccessor(Constructor, "upper");

    installAccessor(Constructor, "lowerOpen");

    installAccessor(Constructor, "upperOpen");

    installMethod(Constructor, "includes", 1);

    {
      defineConstructorBacklink(Constructor.prototype, Constructor);
    }

    {
      defineToStringTag(Constructor.prototype, Constructor.name);
    }

}
  }
{
    const Constructor = constructors["IDBRecord"];

    {

    installAccessor(Constructor, "key");

    installAccessor(Constructor, "primaryKey");

    installAccessor(Constructor, "value");

    {
      defineConstructorBacklink(Constructor.prototype, Constructor);
    }

    {
      defineToStringTag(Constructor.prototype, Constructor.name);
    }

}
  }
  installKeyRangeStatics();
  const indexedDB = runtime.createIDBFactory();
  const getter = Object.getOwnPropertyDescriptor({
    get indexedDB() { return indexedDB; },
  }, "indexedDB").get;
  registerNativeGetter(getter, "indexedDB");
  Object.defineProperty(globalThis, "indexedDB", {
    get: getter,
    enumerable: true,
    configurable: true,
  });
}

function inherit(Constructor, Parent) {
  Object.setPrototypeOf(Constructor.prototype, Parent.prototype);
  Object.setPrototypeOf(Constructor, Parent);
}

function installAccessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() { return runtime.indexedDBProperty(this, name); },
    set [name](value) { runtime.setIndexedDBProperty(this, name, value); },
  }, name);
  registerNativeGetter(descriptor.get, name);
  if (eventHandlers.has(name) || (
    name === "name"
    && ["IDBObjectStore", "IDBIndex"].includes(Constructor.name)
  )) {
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

function installMethod(Constructor, name, length) {
  const callback = {
    [name](...args) {
      return runtime.indexedDBOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}

function installKeyRangeStatics() {
  {
    const callback = {
      ["only"](...args) { return runtime.createKeyRange("only", args); },
    }["only"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "only");
    Object.defineProperty(runtime.IDBKeyRange, "only", {
      value: callback,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
{
    const callback = {
      ["lowerBound"](...args) { return runtime.createKeyRange("lowerBound", args); },
    }["lowerBound"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "lowerBound");
    Object.defineProperty(runtime.IDBKeyRange, "lowerBound", {
      value: callback,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
{
    const callback = {
      ["upperBound"](...args) { return runtime.createKeyRange("upperBound", args); },
    }["upperBound"];
    Object.defineProperty(callback, "length", {
      value: 1,
      configurable: true,
    });
    registerNativeFunction(callback, "upperBound");
    Object.defineProperty(runtime.IDBKeyRange, "upperBound", {
      value: callback,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
{
    const callback = {
      ["bound"](...args) { return runtime.createKeyRange("bound", args); },
    }["bound"];
    Object.defineProperty(callback, "length", {
      value: 2,
      configurable: true,
    });
    registerNativeFunction(callback, "bound");
    Object.defineProperty(runtime.IDBKeyRange, "bound", {
      value: callback,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
}
