import * as runtime from
  "../api/service-worker-managers/service-worker-managers-runtime.js";
import {
  SERVICE_WORKER_MANAGER_SURFACES,
} from
  "../api/service-worker-managers/service-worker-managers-surface.js";
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
  runtime.serviceWorkerManagerConstructors.map(Constructor => [
    Constructor.name,
    Constructor,
  ]),
));

export function installServiceWorkerManagers() {

    delete runtime.serviceWorkerManagerConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.serviceWorkerManagerConstructors[0].name, runtime.serviceWorkerManagerConstructors[0]);

    delete runtime.serviceWorkerManagerConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.serviceWorkerManagerConstructors[1].name, runtime.serviceWorkerManagerConstructors[1]);

    delete runtime.serviceWorkerManagerConstructors[2].prototype.constructor;
    defineGlobalConstructor(runtime.serviceWorkerManagerConstructors[2].name, runtime.serviceWorkerManagerConstructors[2]);

    delete runtime.serviceWorkerManagerConstructors[3].prototype.constructor;
    defineGlobalConstructor(runtime.serviceWorkerManagerConstructors[3].name, runtime.serviceWorkerManagerConstructors[3]);

    delete runtime.serviceWorkerManagerConstructors[4].prototype.constructor;
    defineGlobalConstructor(runtime.serviceWorkerManagerConstructors[4].name, runtime.serviceWorkerManagerConstructors[4]);

    delete runtime.serviceWorkerManagerConstructors[5].prototype.constructor;
    defineGlobalConstructor(runtime.serviceWorkerManagerConstructors[5].name, runtime.serviceWorkerManagerConstructors[5]);

    delete runtime.serviceWorkerManagerConstructors[6].prototype.constructor;
    defineGlobalConstructor(runtime.serviceWorkerManagerConstructors[6].name, runtime.serviceWorkerManagerConstructors[6]);

  {
  {
      const callback = {
        ["getSubscriptions"](...args) {
          return runtime.serviceWorkerManagerOperation(this, "getSubscriptions", args);
        },
      }["getSubscriptions"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "getSubscriptions");
      definePrototypeMethod(constructors["CookieStoreManager"].prototype, "getSubscriptions", callback);
    }
{
      const callback = {
        ["subscribe"](...args) {
          return runtime.serviceWorkerManagerOperation(this, "subscribe", args);
        },
      }["subscribe"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "subscribe");
      definePrototypeMethod(constructors["CookieStoreManager"].prototype, "subscribe", callback);
    }
{
      const callback = {
        ["unsubscribe"](...args) {
          return runtime.serviceWorkerManagerOperation(this, "unsubscribe", args);
        },
      }["unsubscribe"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "unsubscribe");
      definePrototypeMethod(constructors["CookieStoreManager"].prototype, "unsubscribe", callback);
    }

    {
      defineConstructorBacklink(constructors["CookieStoreManager"].prototype, constructors["CookieStoreManager"]);
    }

    {
      defineToStringTag(constructors["CookieStoreManager"].prototype, constructors["CookieStoreManager"].name);
    }

}
{
  {
      const callback = {
        ["disable"](...args) {
          return runtime.serviceWorkerManagerOperation(this, "disable", args);
        },
      }["disable"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "disable");
      definePrototypeMethod(constructors["NavigationPreloadManager"].prototype, "disable", callback);
    }
{
      const callback = {
        ["enable"](...args) {
          return runtime.serviceWorkerManagerOperation(this, "enable", args);
        },
      }["enable"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "enable");
      definePrototypeMethod(constructors["NavigationPreloadManager"].prototype, "enable", callback);
    }
{
      const callback = {
        ["getState"](...args) {
          return runtime.serviceWorkerManagerOperation(this, "getState", args);
        },
      }["getState"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "getState");
      definePrototypeMethod(constructors["NavigationPreloadManager"].prototype, "getState", callback);
    }
{
      const callback = {
        ["setHeaderValue"](...args) {
          return runtime.serviceWorkerManagerOperation(this, "setHeaderValue", args);
        },
      }["setHeaderValue"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "setHeaderValue");
      definePrototypeMethod(constructors["NavigationPreloadManager"].prototype, "setHeaderValue", callback);
    }

    {
      defineConstructorBacklink(constructors["NavigationPreloadManager"].prototype, constructors["NavigationPreloadManager"]);
    }

    {
      defineToStringTag(constructors["NavigationPreloadManager"].prototype, constructors["NavigationPreloadManager"].name);
    }

}
{
  {
      const callback = {
        ["getTags"](...args) {
          return runtime.serviceWorkerManagerOperation(this, "getTags", args);
        },
      }["getTags"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "getTags");
      definePrototypeMethod(constructors["PeriodicSyncManager"].prototype, "getTags", callback);
    }
{
      const callback = {
        ["register"](...args) {
          return runtime.serviceWorkerManagerOperation(this, "register", args);
        },
      }["register"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "register");
      definePrototypeMethod(constructors["PeriodicSyncManager"].prototype, "register", callback);
    }
{
      const callback = {
        ["unregister"](...args) {
          return runtime.serviceWorkerManagerOperation(this, "unregister", args);
        },
      }["unregister"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "unregister");
      definePrototypeMethod(constructors["PeriodicSyncManager"].prototype, "unregister", callback);
    }

    {
      defineConstructorBacklink(constructors["PeriodicSyncManager"].prototype, constructors["PeriodicSyncManager"]);
    }

    {
      defineToStringTag(constructors["PeriodicSyncManager"].prototype, constructors["PeriodicSyncManager"].name);
    }

}
{
  {
      const callback = {
        ["getSubscription"](...args) {
          return runtime.serviceWorkerManagerOperation(this, "getSubscription", args);
        },
      }["getSubscription"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "getSubscription");
      definePrototypeMethod(constructors["PushManager"].prototype, "getSubscription", callback);
    }
{
      const callback = {
        ["permissionState"](...args) {
          return runtime.serviceWorkerManagerOperation(this, "permissionState", args);
        },
      }["permissionState"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "permissionState");
      definePrototypeMethod(constructors["PushManager"].prototype, "permissionState", callback);
    }
{
      const callback = {
        ["subscribe"](...args) {
          return runtime.serviceWorkerManagerOperation(this, "subscribe", args);
        },
      }["subscribe"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "subscribe");
      definePrototypeMethod(constructors["PushManager"].prototype, "subscribe", callback);
    }

    {
      defineConstructorBacklink(constructors["PushManager"].prototype, constructors["PushManager"]);
    }

    {
      defineToStringTag(constructors["PushManager"].prototype, constructors["PushManager"].name);
    }

}
{
  {
      const getter = Object.getOwnPropertyDescriptor({
        get ["endpoint"]() {
          return runtime.serviceWorkerManagerProperty(this, "endpoint");
        },
      }, "endpoint").get;
      registerNativeGetter(getter, "endpoint");
      definePrototypeGetter(constructors["PushSubscription"].prototype, "endpoint", getter);
    }
{
      const getter = Object.getOwnPropertyDescriptor({
        get ["expirationTime"]() {
          return runtime.serviceWorkerManagerProperty(this, "expirationTime");
        },
      }, "expirationTime").get;
      registerNativeGetter(getter, "expirationTime");
      definePrototypeGetter(constructors["PushSubscription"].prototype, "expirationTime", getter);
    }
{
      const getter = Object.getOwnPropertyDescriptor({
        get ["options"]() {
          return runtime.serviceWorkerManagerProperty(this, "options");
        },
      }, "options").get;
      registerNativeGetter(getter, "options");
      definePrototypeGetter(constructors["PushSubscription"].prototype, "options", getter);
    }
{
      const callback = {
        ["getKey"](...args) {
          return runtime.serviceWorkerManagerOperation(this, "getKey", args);
        },
      }["getKey"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "getKey");
      definePrototypeMethod(constructors["PushSubscription"].prototype, "getKey", callback);
    }
{
      const callback = {
        ["toJSON"](...args) {
          return runtime.serviceWorkerManagerOperation(this, "toJSON", args);
        },
      }["toJSON"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "toJSON");
      definePrototypeMethod(constructors["PushSubscription"].prototype, "toJSON", callback);
    }
{
      const callback = {
        ["unsubscribe"](...args) {
          return runtime.serviceWorkerManagerOperation(this, "unsubscribe", args);
        },
      }["unsubscribe"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "unsubscribe");
      definePrototypeMethod(constructors["PushSubscription"].prototype, "unsubscribe", callback);
    }

    {
      defineConstructorBacklink(constructors["PushSubscription"].prototype, constructors["PushSubscription"]);
    }

    {
      defineToStringTag(constructors["PushSubscription"].prototype, constructors["PushSubscription"].name);
    }

}
{
  {
      const getter = Object.getOwnPropertyDescriptor({
        get ["userVisibleOnly"]() {
          return runtime.serviceWorkerManagerProperty(this, "userVisibleOnly");
        },
      }, "userVisibleOnly").get;
      registerNativeGetter(getter, "userVisibleOnly");
      definePrototypeGetter(constructors["PushSubscriptionOptions"].prototype, "userVisibleOnly", getter);
    }
{
      const getter = Object.getOwnPropertyDescriptor({
        get ["applicationServerKey"]() {
          return runtime.serviceWorkerManagerProperty(this, "applicationServerKey");
        },
      }, "applicationServerKey").get;
      registerNativeGetter(getter, "applicationServerKey");
      definePrototypeGetter(constructors["PushSubscriptionOptions"].prototype, "applicationServerKey", getter);
    }

    {
      defineConstructorBacklink(constructors["PushSubscriptionOptions"].prototype, constructors["PushSubscriptionOptions"]);
    }

    {
      defineToStringTag(constructors["PushSubscriptionOptions"].prototype, constructors["PushSubscriptionOptions"].name);
    }

}
{
  {
      const callback = {
        ["getTags"](...args) {
          return runtime.serviceWorkerManagerOperation(this, "getTags", args);
        },
      }["getTags"];
      Object.defineProperty(callback, "length", {
        value: 0,
        configurable: true,
      });
      registerNativeFunction(callback, "getTags");
      definePrototypeMethod(constructors["SyncManager"].prototype, "getTags", callback);
    }
{
      const callback = {
        ["register"](...args) {
          return runtime.serviceWorkerManagerOperation(this, "register", args);
        },
      }["register"];
      Object.defineProperty(callback, "length", {
        value: 1,
        configurable: true,
      });
      registerNativeFunction(callback, "register");
      definePrototypeMethod(constructors["SyncManager"].prototype, "register", callback);
    }

    {
      defineConstructorBacklink(constructors["SyncManager"].prototype, constructors["SyncManager"]);
    }

    {
      defineToStringTag(constructors["SyncManager"].prototype, constructors["SyncManager"].name);
    }

}
  const getter = Object.getOwnPropertyDescriptor({
    get supportedContentEncodings() {
      return ["aes128gcm", "aesgcm"];
    },
  }, "supportedContentEncodings").get;
  registerNativeGetter(getter, "supportedContentEncodings");
  Object.defineProperty(runtime.PushManager, "supportedContentEncodings", {
    get: getter,
    enumerable: true,
    configurable: true,
  });
}
