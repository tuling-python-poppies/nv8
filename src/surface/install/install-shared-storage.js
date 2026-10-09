import * as runtime from "../api/shared-storage/shared-storage-runtime.js";
import {
  SHARED_STORAGE_SURFACES,
} from "../api/shared-storage/shared-storage-surface.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

const constructors = Object.freeze(Object.fromEntries(
  runtime.sharedStorageConstructors.map(Constructor => [
    Constructor.name,
    Constructor,
  ]),
));

export function installSharedStorage(browserMajorVersion = 150) {
  if (browserMajorVersion >= 154) {
    delete globalThis.sharedStorage;
    for (const Constructor of runtime.sharedStorageConstructors) {
      delete globalThis[Constructor.name];
    }
    return;
  }
  runtime.resetSharedStorage();

    delete runtime.sharedStorageConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.sharedStorageConstructors[0].name, runtime.sharedStorageConstructors[0]);

    delete runtime.sharedStorageConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.sharedStorageConstructors[1].name, runtime.sharedStorageConstructors[1]);

    delete runtime.sharedStorageConstructors[2].prototype.constructor;
    defineGlobalConstructor(runtime.sharedStorageConstructors[2].name, runtime.sharedStorageConstructors[2]);

    delete runtime.sharedStorageConstructors[3].prototype.constructor;
    defineGlobalConstructor(runtime.sharedStorageConstructors[3].name, runtime.sharedStorageConstructors[3]);

    delete runtime.sharedStorageConstructors[4].prototype.constructor;
    defineGlobalConstructor(runtime.sharedStorageConstructors[4].name, runtime.sharedStorageConstructors[4]);

    delete runtime.sharedStorageConstructors[5].prototype.constructor;
    defineGlobalConstructor(runtime.sharedStorageConstructors[5].name, runtime.sharedStorageConstructors[5]);

    delete runtime.sharedStorageConstructors[6].prototype.constructor;
    defineGlobalConstructor(runtime.sharedStorageConstructors[6].name, runtime.sharedStorageConstructors[6]);

  {
    const Constructor = constructors["SharedStorage"];
    const Parent = constructors[(((((Object.entries(SHARED_STORAGE_SURFACES))[0]))[1])).prototypeParent];
    if (Parent !== undefined) {
      Object.setPrototypeOf(Constructor.prototype, Parent.prototype);
      Object.setPrototypeOf(Constructor, Parent);
    }
    {
  {
      const callback = {
        ["append"](...args) {
          return runtime.sharedStorageOperation(this, "append", args);
        },
      }["append"];
      Object.defineProperty(callback, "length", {
        value: 2,
        configurable: true,
      });
      registerNativeFunction(callback, "append");
      definePrototypeMethod(Constructor.prototype, "append", callback);
    }
{
      const callback = {
        ["clear"](...args) {
          return runtime.sharedStorageOperation(this, "clear", args);
        },
      }["clear"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "clear");
      definePrototypeMethod(Constructor.prototype, "clear", callback);
    }
{
      const callback = {
        ["delete"](...args) {
          return runtime.sharedStorageOperation(this, "delete", args);
        },
      }["delete"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "delete");
      definePrototypeMethod(Constructor.prototype, "delete", callback);
    }
{
      const callback = {
        ["set"](...args) {
          return runtime.sharedStorageOperation(this, "set", args);
        },
      }["set"];
      Object.defineProperty(callback, "length", {
        value: 2,
        configurable: true,
      });
      registerNativeFunction(callback, "set");
      definePrototypeMethod(Constructor.prototype, "set", callback);
    }
{
      const callback = {
        ["batchUpdate"](...args) {
          return runtime.sharedStorageOperation(this, "batchUpdate", args);
        },
      }["batchUpdate"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "batchUpdate");
      definePrototypeMethod(Constructor.prototype, "batchUpdate", callback);
    }

    {
      defineConstructorBacklink(Constructor.prototype, Constructor);
    }

{
      const getter = Object.getOwnPropertyDescriptor({
        get ["worklet"]() {
          return runtime.sharedStorageProperty(this, "worklet");
        },
      }, "worklet").get;
      registerNativeGetter(getter, "worklet");
      definePrototypeGetter(Constructor.prototype, "worklet", getter);
    }
{
      const callback = {
        ["createWorklet"](...args) {
          return runtime.sharedStorageOperation(this, "createWorklet", args);
        },
      }["createWorklet"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "createWorklet");
      definePrototypeMethod(Constructor.prototype, "createWorklet", callback);
    }
{
      const callback = {
        ["run"](...args) {
          return runtime.sharedStorageOperation(this, "run", args);
        },
      }["run"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "run");
      definePrototypeMethod(Constructor.prototype, "run", callback);
    }
{
      const callback = {
        ["selectURL"](...args) {
          return runtime.sharedStorageOperation(this, "selectURL", args);
        },
      }["selectURL"];
      Object.defineProperty(callback, "length", {
        value: 2,
        configurable: true,
      });
      registerNativeFunction(callback, "selectURL");
      definePrototypeMethod(Constructor.prototype, "selectURL", callback);
    }

    {
      defineToStringTag(Constructor.prototype, Constructor.name);
    }

}
  }
{
    const Constructor = constructors["SharedStorageWorklet"];
    const Parent = constructors[(((((Object.entries(SHARED_STORAGE_SURFACES))[1]))[1])).prototypeParent];
    if (Parent !== undefined) {
      Object.setPrototypeOf(Constructor.prototype, Parent.prototype);
      Object.setPrototypeOf(Constructor, Parent);
    }
    {
  {
      const callback = {
        ["addModule"](...args) {
          return runtime.sharedStorageOperation(this, "addModule", args);
        },
      }["addModule"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "addModule");
      definePrototypeMethod(Constructor.prototype, "addModule", callback);
    }

    {
      defineConstructorBacklink(Constructor.prototype, Constructor);
    }

{
      const callback = {
        ["run"](...args) {
          return runtime.sharedStorageOperation(this, "run", args);
        },
      }["run"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "run");
      definePrototypeMethod(Constructor.prototype, "run", callback);
    }
{
      const callback = {
        ["selectURL"](...args) {
          return runtime.sharedStorageOperation(this, "selectURL", args);
        },
      }["selectURL"];
      Object.defineProperty(callback, "length", {
        value: 2,
        configurable: true,
      });
      registerNativeFunction(callback, "selectURL");
      definePrototypeMethod(Constructor.prototype, "selectURL", callback);
    }

    {
      defineToStringTag(Constructor.prototype, Constructor.name);
    }

}
  }
{
    const Constructor = constructors["SharedStorageAppendMethod"];
    const Parent = constructors[(((((Object.entries(SHARED_STORAGE_SURFACES))[2]))[1])).prototypeParent];
    if (Parent !== undefined) {
      Object.setPrototypeOf(Constructor.prototype, Parent.prototype);
      Object.setPrototypeOf(Constructor, Parent);
    }
    {

    {
      defineConstructorBacklink(Constructor.prototype, Constructor);
    }

    {
      defineToStringTag(Constructor.prototype, Constructor.name);
    }

}
  }
{
    const Constructor = constructors["SharedStorageClearMethod"];
    const Parent = constructors[(((((Object.entries(SHARED_STORAGE_SURFACES))[3]))[1])).prototypeParent];
    if (Parent !== undefined) {
      Object.setPrototypeOf(Constructor.prototype, Parent.prototype);
      Object.setPrototypeOf(Constructor, Parent);
    }
    {

    {
      defineConstructorBacklink(Constructor.prototype, Constructor);
    }

    {
      defineToStringTag(Constructor.prototype, Constructor.name);
    }

}
  }
{
    const Constructor = constructors["SharedStorageDeleteMethod"];
    const Parent = constructors[(((((Object.entries(SHARED_STORAGE_SURFACES))[4]))[1])).prototypeParent];
    if (Parent !== undefined) {
      Object.setPrototypeOf(Constructor.prototype, Parent.prototype);
      Object.setPrototypeOf(Constructor, Parent);
    }
    {

    {
      defineConstructorBacklink(Constructor.prototype, Constructor);
    }

    {
      defineToStringTag(Constructor.prototype, Constructor.name);
    }

}
  }
{
    const Constructor = constructors["SharedStorageModifierMethod"];
    const Parent = constructors[(((((Object.entries(SHARED_STORAGE_SURFACES))[5]))[1])).prototypeParent];
    if (Parent !== undefined) {
      Object.setPrototypeOf(Constructor.prototype, Parent.prototype);
      Object.setPrototypeOf(Constructor, Parent);
    }
    {

    {
      defineConstructorBacklink(Constructor.prototype, Constructor);
    }

    {
      defineToStringTag(Constructor.prototype, Constructor.name);
    }

}
  }
{
    const Constructor = constructors["SharedStorageSetMethod"];
    const Parent = constructors[(((((Object.entries(SHARED_STORAGE_SURFACES))[6]))[1])).prototypeParent];
    if (Parent !== undefined) {
      Object.setPrototypeOf(Constructor.prototype, Parent.prototype);
      Object.setPrototypeOf(Constructor, Parent);
    }
    {

    {
      defineConstructorBacklink(Constructor.prototype, Constructor);
    }

    {
      defineToStringTag(Constructor.prototype, Constructor.name);
    }

}
  }
  const descriptor = Object.getOwnPropertyDescriptor({
    get sharedStorage() {
      return runtime.sharedStorageGlobal();
    },
  }, "sharedStorage");
  registerNativeGetter(descriptor.get, "sharedStorage");
  Object.defineProperty(globalThis, "sharedStorage", {
    get: descriptor.get,
    enumerable: true,
    configurable: true,
  });
}
