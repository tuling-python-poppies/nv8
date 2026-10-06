import { EventTarget } from "../api/event/event-target-constructor.js";
import * as runtime from "../api/background-fetch/background-fetch-runtime.js";
import {
  BACKGROUND_FETCH_SURFACES,
} from "../api/background-fetch/background-fetch-surface.js";
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
  runtime.backgroundFetchConstructors.map(Constructor => [
    Constructor.name,
    Constructor,
  ]),
));

export function installBackgroundFetch() {

    delete runtime.backgroundFetchConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.backgroundFetchConstructors[0].name, runtime.backgroundFetchConstructors[0]);

    delete runtime.backgroundFetchConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.backgroundFetchConstructors[1].name, runtime.backgroundFetchConstructors[1]);

    delete runtime.backgroundFetchConstructors[2].prototype.constructor;
    defineGlobalConstructor(runtime.backgroundFetchConstructors[2].name, runtime.backgroundFetchConstructors[2]);

  {
    const Constructor = constructors["BackgroundFetchManager"];

    {
  {
      const callback = {
        ["fetch"](...args) {
          return runtime.backgroundFetchOperation(this, "fetch", args);
        },
      }["fetch"];
      Object.defineProperty(callback, "length", {
        value: 2,
        configurable: true,
      });
      registerNativeFunction(callback, "fetch");
      definePrototypeMethod(Constructor.prototype, "fetch", callback);
    }
{
      const callback = {
        ["get"](...args) {
          return runtime.backgroundFetchOperation(this, "get", args);
        },
      }["get"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "get");
      definePrototypeMethod(Constructor.prototype, "get", callback);
    }
{
      const callback = {
        ["getIds"](...args) {
          return runtime.backgroundFetchOperation(this, "getIds", args);
        },
      }["getIds"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "getIds");
      definePrototypeMethod(Constructor.prototype, "getIds", callback);
    }

    {
      defineConstructorBacklink(Constructor.prototype, Constructor);
    }

    {
      defineToStringTag(Constructor.prototype, Constructor.name);
    }

}
  }
{
    const Constructor = constructors["BackgroundFetchRecord"];

    {

    {
      installAccessor(Constructor, "request");
    }

    {
      installAccessor(Constructor, "responseReady");
    }

    {
      defineConstructorBacklink(Constructor.prototype, Constructor);
    }

    {
      defineToStringTag(Constructor.prototype, Constructor.name);
    }

}
  }
{
    const Constructor = constructors["BackgroundFetchRegistration"];
    {
      Object.setPrototypeOf(Constructor.prototype, EventTarget.prototype);
      Object.setPrototypeOf(Constructor, EventTarget);
    }
    {

    {
      installAccessor(Constructor, "id");
    }

    {
      installAccessor(Constructor, "uploadTotal");
    }

    {
      installAccessor(Constructor, "uploaded");
    }

    {
      installAccessor(Constructor, "downloadTotal");
    }

    {
      installAccessor(Constructor, "downloaded");
    }

    {
      installAccessor(Constructor, "result");
    }

    {
      installAccessor(Constructor, "failureReason");
    }

    {
      installAccessor(Constructor, "recordsAvailable");
    }

    {
      installAccessor(Constructor, "onprogress");
    }

{
      const callback = {
        ["abort"](...args) {
          return runtime.backgroundFetchOperation(this, "abort", args);
        },
      }["abort"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "abort");
      definePrototypeMethod(Constructor.prototype, "abort", callback);
    }
{
      const callback = {
        ["match"](...args) {
          return runtime.backgroundFetchOperation(this, "match", args);
        },
      }["match"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "match");
      definePrototypeMethod(Constructor.prototype, "match", callback);
    }
{
      const callback = {
        ["matchAll"](...args) {
          return runtime.backgroundFetchOperation(this, "matchAll", args);
        },
      }["matchAll"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "matchAll");
      definePrototypeMethod(Constructor.prototype, "matchAll", callback);
    }

    {
      defineConstructorBacklink(Constructor.prototype, Constructor);
    }

    {
      defineToStringTag(Constructor.prototype, Constructor.name);
    }

}
  }
}

function installAccessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return runtime.backgroundFetchProperty(this, name);
    },
    set [name](value) {
      runtime.setBackgroundFetchProperty(this, name, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  if (name === "onprogress") {
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
