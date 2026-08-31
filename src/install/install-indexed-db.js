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
} from "../webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../webidl/native-function.js";

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
  do {
    delete (((runtime.indexedDBConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.indexedDBConstructors)[0])).name, (((runtime.indexedDBConstructors)[0])));
  } while (false);
do {
    delete (((runtime.indexedDBConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.indexedDBConstructors)[1])).name, (((runtime.indexedDBConstructors)[1])));
  } while (false);
do {
    delete (((runtime.indexedDBConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((runtime.indexedDBConstructors)[2])).name, (((runtime.indexedDBConstructors)[2])));
  } while (false);
do {
    delete (((runtime.indexedDBConstructors)[3])).prototype.constructor;
    defineGlobalConstructor((((runtime.indexedDBConstructors)[3])).name, (((runtime.indexedDBConstructors)[3])));
  } while (false);
do {
    delete (((runtime.indexedDBConstructors)[4])).prototype.constructor;
    defineGlobalConstructor((((runtime.indexedDBConstructors)[4])).name, (((runtime.indexedDBConstructors)[4])));
  } while (false);
do {
    delete (((runtime.indexedDBConstructors)[5])).prototype.constructor;
    defineGlobalConstructor((((runtime.indexedDBConstructors)[5])).name, (((runtime.indexedDBConstructors)[5])));
  } while (false);
do {
    delete (((runtime.indexedDBConstructors)[6])).prototype.constructor;
    defineGlobalConstructor((((runtime.indexedDBConstructors)[6])).name, (((runtime.indexedDBConstructors)[6])));
  } while (false);
do {
    delete (((runtime.indexedDBConstructors)[7])).prototype.constructor;
    defineGlobalConstructor((((runtime.indexedDBConstructors)[7])).name, (((runtime.indexedDBConstructors)[7])));
  } while (false);
do {
    delete (((runtime.indexedDBConstructors)[8])).prototype.constructor;
    defineGlobalConstructor((((runtime.indexedDBConstructors)[8])).name, (((runtime.indexedDBConstructors)[8])));
  } while (false);
do {
    delete (((runtime.indexedDBConstructors)[9])).prototype.constructor;
    defineGlobalConstructor((((runtime.indexedDBConstructors)[9])).name, (((runtime.indexedDBConstructors)[9])));
  } while (false);
do {
    delete (((runtime.indexedDBConstructors)[10])).prototype.constructor;
    defineGlobalConstructor((((runtime.indexedDBConstructors)[10])).name, (((runtime.indexedDBConstructors)[10])));
  } while (false);
  do {
    const Constructor = constructors[("IDBFactory")];
    
    {
  do {
    installMethod((Constructor), ("cmp"), (2));
  } while (false);
do {
    installMethod((Constructor), ("databases"), (0));
  } while (false);
do {
    installMethod((Constructor), ("deleteDatabase"), (1));
  } while (false);
do {
    installMethod((Constructor), ("open"), (1));
  } while (false);
do {
    {
      defineConstructorBacklink((Constructor).prototype, (Constructor));
    }
  } while (false);
do {
    {
      defineToStringTag((Constructor).prototype, (Constructor).name);
    }
  } while (false);
}
  } while (false);
do {
    const Constructor = constructors[("IDBDatabase")];
    {
      inherit(Constructor, EventTarget);
    }
    {
  do {
    installAccessor((Constructor), ("name"));
  } while (false);
do {
    installAccessor((Constructor), ("version"));
  } while (false);
do {
    installAccessor((Constructor), ("objectStoreNames"));
  } while (false);
do {
    installAccessor((Constructor), ("onabort"));
  } while (false);
do {
    installAccessor((Constructor), ("onclose"));
  } while (false);
do {
    installAccessor((Constructor), ("onerror"));
  } while (false);
do {
    installAccessor((Constructor), ("onversionchange"));
  } while (false);
do {
    installMethod((Constructor), ("close"), (0));
  } while (false);
do {
    installMethod((Constructor), ("createObjectStore"), (1));
  } while (false);
do {
    installMethod((Constructor), ("deleteObjectStore"), (1));
  } while (false);
do {
    installMethod((Constructor), ("transaction"), (1));
  } while (false);
do {
    {
      defineConstructorBacklink((Constructor).prototype, (Constructor));
    }
  } while (false);
do {
    {
      defineToStringTag((Constructor).prototype, (Constructor).name);
    }
  } while (false);
}
  } while (false);
do {
    const Constructor = constructors[("IDBTransaction")];
    {
      inherit(Constructor, EventTarget);
    }
    {
  do {
    installAccessor((Constructor), ("objectStoreNames"));
  } while (false);
do {
    installAccessor((Constructor), ("mode"));
  } while (false);
do {
    installAccessor((Constructor), ("durability"));
  } while (false);
do {
    installAccessor((Constructor), ("db"));
  } while (false);
do {
    installAccessor((Constructor), ("error"));
  } while (false);
do {
    installAccessor((Constructor), ("onabort"));
  } while (false);
do {
    installAccessor((Constructor), ("oncomplete"));
  } while (false);
do {
    installAccessor((Constructor), ("onerror"));
  } while (false);
do {
    installMethod((Constructor), ("abort"), (0));
  } while (false);
do {
    installMethod((Constructor), ("commit"), (0));
  } while (false);
do {
    installMethod((Constructor), ("objectStore"), (1));
  } while (false);
do {
    {
      defineConstructorBacklink((Constructor).prototype, (Constructor));
    }
  } while (false);
do {
    {
      defineToStringTag((Constructor).prototype, (Constructor).name);
    }
  } while (false);
}
  } while (false);
do {
    const Constructor = constructors[("IDBRequest")];
    {
      inherit(Constructor, EventTarget);
    }
    {
  do {
    installAccessor((Constructor), ("result"));
  } while (false);
do {
    installAccessor((Constructor), ("error"));
  } while (false);
do {
    installAccessor((Constructor), ("source"));
  } while (false);
do {
    installAccessor((Constructor), ("transaction"));
  } while (false);
do {
    installAccessor((Constructor), ("readyState"));
  } while (false);
do {
    installAccessor((Constructor), ("onsuccess"));
  } while (false);
do {
    installAccessor((Constructor), ("onerror"));
  } while (false);
do {
    {
      defineConstructorBacklink((Constructor).prototype, (Constructor));
    }
  } while (false);
do {
    {
      defineToStringTag((Constructor).prototype, (Constructor).name);
    }
  } while (false);
}
  } while (false);
do {
    const Constructor = constructors[("IDBOpenDBRequest")];
    {
      inherit(Constructor, runtime.IDBRequest);
    }
    {
  do {
    installAccessor((Constructor), ("onblocked"));
  } while (false);
do {
    installAccessor((Constructor), ("onupgradeneeded"));
  } while (false);
do {
    {
      defineConstructorBacklink((Constructor).prototype, (Constructor));
    }
  } while (false);
do {
    {
      defineToStringTag((Constructor).prototype, (Constructor).name);
    }
  } while (false);
}
  } while (false);
do {
    const Constructor = constructors[("IDBObjectStore")];
    
    {
  do {
    installAccessor((Constructor), ("name"));
  } while (false);
do {
    installAccessor((Constructor), ("keyPath"));
  } while (false);
do {
    installAccessor((Constructor), ("indexNames"));
  } while (false);
do {
    installAccessor((Constructor), ("transaction"));
  } while (false);
do {
    installAccessor((Constructor), ("autoIncrement"));
  } while (false);
do {
    installMethod((Constructor), ("add"), (1));
  } while (false);
do {
    installMethod((Constructor), ("clear"), (0));
  } while (false);
do {
    installMethod((Constructor), ("count"), (0));
  } while (false);
do {
    installMethod((Constructor), ("createIndex"), (2));
  } while (false);
do {
    installMethod((Constructor), ("delete"), (1));
  } while (false);
do {
    installMethod((Constructor), ("deleteIndex"), (1));
  } while (false);
do {
    installMethod((Constructor), ("get"), (1));
  } while (false);
do {
    installMethod((Constructor), ("getAll"), (0));
  } while (false);
do {
    installMethod((Constructor), ("getAllKeys"), (0));
  } while (false);
do {
    installMethod((Constructor), ("getAllRecords"), (0));
  } while (false);
do {
    installMethod((Constructor), ("getKey"), (1));
  } while (false);
do {
    installMethod((Constructor), ("index"), (1));
  } while (false);
do {
    installMethod((Constructor), ("openCursor"), (0));
  } while (false);
do {
    installMethod((Constructor), ("openKeyCursor"), (0));
  } while (false);
do {
    installMethod((Constructor), ("put"), (1));
  } while (false);
do {
    {
      defineConstructorBacklink((Constructor).prototype, (Constructor));
    }
  } while (false);
do {
    {
      defineToStringTag((Constructor).prototype, (Constructor).name);
    }
  } while (false);
}
  } while (false);
do {
    const Constructor = constructors[("IDBIndex")];
    
    {
  do {
    installAccessor((Constructor), ("name"));
  } while (false);
do {
    installAccessor((Constructor), ("objectStore"));
  } while (false);
do {
    installAccessor((Constructor), ("keyPath"));
  } while (false);
do {
    installAccessor((Constructor), ("multiEntry"));
  } while (false);
do {
    installAccessor((Constructor), ("unique"));
  } while (false);
do {
    installMethod((Constructor), ("count"), (0));
  } while (false);
do {
    installMethod((Constructor), ("get"), (1));
  } while (false);
do {
    installMethod((Constructor), ("getAll"), (0));
  } while (false);
do {
    installMethod((Constructor), ("getAllKeys"), (0));
  } while (false);
do {
    installMethod((Constructor), ("getAllRecords"), (0));
  } while (false);
do {
    installMethod((Constructor), ("getKey"), (1));
  } while (false);
do {
    installMethod((Constructor), ("openCursor"), (0));
  } while (false);
do {
    installMethod((Constructor), ("openKeyCursor"), (0));
  } while (false);
do {
    {
      defineConstructorBacklink((Constructor).prototype, (Constructor));
    }
  } while (false);
do {
    {
      defineToStringTag((Constructor).prototype, (Constructor).name);
    }
  } while (false);
}
  } while (false);
do {
    const Constructor = constructors[("IDBCursor")];
    
    {
  do {
    installAccessor((Constructor), ("source"));
  } while (false);
do {
    installAccessor((Constructor), ("direction"));
  } while (false);
do {
    installAccessor((Constructor), ("key"));
  } while (false);
do {
    installAccessor((Constructor), ("primaryKey"));
  } while (false);
do {
    installAccessor((Constructor), ("request"));
  } while (false);
do {
    installMethod((Constructor), ("advance"), (1));
  } while (false);
do {
    installMethod((Constructor), ("continue"), (0));
  } while (false);
do {
    installMethod((Constructor), ("continuePrimaryKey"), (2));
  } while (false);
do {
    installMethod((Constructor), ("delete"), (0));
  } while (false);
do {
    installMethod((Constructor), ("update"), (1));
  } while (false);
do {
    {
      defineConstructorBacklink((Constructor).prototype, (Constructor));
    }
  } while (false);
do {
    {
      defineToStringTag((Constructor).prototype, (Constructor).name);
    }
  } while (false);
}
  } while (false);
do {
    const Constructor = constructors[("IDBCursorWithValue")];
    {
      inherit(Constructor, runtime.IDBCursor);
    }
    {
  do {
    installAccessor((Constructor), ("value"));
  } while (false);
do {
    {
      defineConstructorBacklink((Constructor).prototype, (Constructor));
    }
  } while (false);
do {
    {
      defineToStringTag((Constructor).prototype, (Constructor).name);
    }
  } while (false);
}
  } while (false);
do {
    const Constructor = constructors[("IDBKeyRange")];
    
    {
  do {
    installAccessor((Constructor), ("lower"));
  } while (false);
do {
    installAccessor((Constructor), ("upper"));
  } while (false);
do {
    installAccessor((Constructor), ("lowerOpen"));
  } while (false);
do {
    installAccessor((Constructor), ("upperOpen"));
  } while (false);
do {
    installMethod((Constructor), ("includes"), (1));
  } while (false);
do {
    {
      defineConstructorBacklink((Constructor).prototype, (Constructor));
    }
  } while (false);
do {
    {
      defineToStringTag((Constructor).prototype, (Constructor).name);
    }
  } while (false);
}
  } while (false);
do {
    const Constructor = constructors[("IDBRecord")];
    
    {
  do {
    installAccessor((Constructor), ("key"));
  } while (false);
do {
    installAccessor((Constructor), ("primaryKey"));
  } while (false);
do {
    installAccessor((Constructor), ("value"));
  } while (false);
do {
    {
      defineConstructorBacklink((Constructor).prototype, (Constructor));
    }
  } while (false);
do {
    {
      defineToStringTag((Constructor).prototype, (Constructor).name);
    }
  } while (false);
}
  } while (false);
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
  do {
    const callback = {
      [("only")](...args) { return runtime.createKeyRange(("only"), args); },
    }[("only")];
    Object.defineProperty(callback, "length", {
      value: (1),
      configurable: true,
    });
    registerNativeFunction(callback, ("only"));
    Object.defineProperty(runtime.IDBKeyRange, ("only"), {
      value: callback,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } while (false);
do {
    const callback = {
      [("lowerBound")](...args) { return runtime.createKeyRange(("lowerBound"), args); },
    }[("lowerBound")];
    Object.defineProperty(callback, "length", {
      value: (1),
      configurable: true,
    });
    registerNativeFunction(callback, ("lowerBound"));
    Object.defineProperty(runtime.IDBKeyRange, ("lowerBound"), {
      value: callback,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } while (false);
do {
    const callback = {
      [("upperBound")](...args) { return runtime.createKeyRange(("upperBound"), args); },
    }[("upperBound")];
    Object.defineProperty(callback, "length", {
      value: (1),
      configurable: true,
    });
    registerNativeFunction(callback, ("upperBound"));
    Object.defineProperty(runtime.IDBKeyRange, ("upperBound"), {
      value: callback,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } while (false);
do {
    const callback = {
      [("bound")](...args) { return runtime.createKeyRange(("bound"), args); },
    }[("bound")];
    Object.defineProperty(callback, "length", {
      value: (2),
      configurable: true,
    });
    registerNativeFunction(callback, ("bound"));
    Object.defineProperty(runtime.IDBKeyRange, ("bound"), {
      value: callback,
      writable: true,
      enumerable: true,
      configurable: true,
    });
  } while (false);
}
