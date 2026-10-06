import { EventTarget } from "../api/event/event-target-constructor.js";
import {
  ServiceWorker,
  ServiceWorkerContainer,
  ServiceWorkerRegistration,
  containerGetRegistration,
  containerGetRegistrations,
  containerProperty,
  containerRegister,
  containerStartMessages,
  registrationProperty,
  registrationUnregister,
  registrationUpdate,
  serviceWorkerHandler,
  serviceWorkerPostMessage,
  serviceWorkerProperty,
  setServiceWorkerHandler,
} from "../api/worker/service-worker-runtime.js";
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

export function installServiceWorker() {

    Object.setPrototypeOf(ServiceWorker.prototype, EventTarget.prototype);
    Object.setPrototypeOf(ServiceWorker, EventTarget);
    delete ServiceWorker.prototype.constructor;
    defineGlobalConstructor(ServiceWorker.name, ServiceWorker);

    Object.setPrototypeOf(ServiceWorkerRegistration.prototype, EventTarget.prototype);
    Object.setPrototypeOf(ServiceWorkerRegistration, EventTarget);
    delete ServiceWorkerRegistration.prototype.constructor;
    defineGlobalConstructor(ServiceWorkerRegistration.name, ServiceWorkerRegistration);

    Object.setPrototypeOf(ServiceWorkerContainer.prototype, EventTarget.prototype);
    Object.setPrototypeOf(ServiceWorkerContainer, EventTarget);
    delete ServiceWorkerContainer.prototype.constructor;
    defineGlobalConstructor(ServiceWorkerContainer.name, ServiceWorkerContainer);

  installServiceWorkerInstance();
  installRegistration();
  installContainer();
}

function installServiceWorkerInstance() {
  getter(ServiceWorker, "scriptURL", serviceWorkerProperty);
  getter(ServiceWorker, "state", serviceWorkerProperty);
  handler(ServiceWorker, "onstatechange");
  method(ServiceWorker, "postMessage", 1, serviceWorkerPostMessage);
  defineConstructorBacklink(ServiceWorker.prototype, ServiceWorker);
  handler(ServiceWorker, "onerror");
  defineToStringTag(ServiceWorker.prototype, "ServiceWorker");
}

function installRegistration() {
  getter(ServiceWorkerRegistration, "installing", registrationProperty);
getter(ServiceWorkerRegistration, "waiting", registrationProperty);
getter(ServiceWorkerRegistration, "active", registrationProperty);
getter(ServiceWorkerRegistration, "navigationPreload", registrationProperty);
getter(ServiceWorkerRegistration, "scope", registrationProperty);
getter(ServiceWorkerRegistration, "updateViaCache", registrationProperty);
  handler(ServiceWorkerRegistration, "onupdatefound");
  method(
    ServiceWorkerRegistration,
    "unregister",
    0,
    registrationUnregister,
  );
  method(ServiceWorkerRegistration, "update", 0, registrationUpdate);
  getter(ServiceWorkerRegistration, "paymentManager", registrationProperty);
  defineConstructorBacklink(
    ServiceWorkerRegistration.prototype,
    ServiceWorkerRegistration,
  );
  getter(ServiceWorkerRegistration, "backgroundFetch", registrationProperty);
getter(ServiceWorkerRegistration, "periodicSync", registrationProperty);
getter(ServiceWorkerRegistration, "sync", registrationProperty);
getter(ServiceWorkerRegistration, "cookies", registrationProperty);
getter(ServiceWorkerRegistration, "pushManager", registrationProperty);
  method(
    ServiceWorkerRegistration,
    "getNotifications",
    0,
    () => Promise.resolve([]),
  );
  method(
    ServiceWorkerRegistration,
    "showNotification",
    1,
    () => Promise.resolve(),
  );
  defineToStringTag(
    ServiceWorkerRegistration.prototype,
    "ServiceWorkerRegistration",
  );
}

function installContainer() {
  getter(ServiceWorkerContainer, "controller", containerProperty);
  getter(ServiceWorkerContainer, "ready", containerProperty);
  handler(ServiceWorkerContainer, "oncontrollerchange");
  handler(ServiceWorkerContainer, "onmessage");
  handler(ServiceWorkerContainer, "onmessageerror");
  method(
    ServiceWorkerContainer,
    "getRegistration",
    0,
    containerGetRegistration,
  );
  method(
    ServiceWorkerContainer,
    "getRegistrations",
    0,
    containerGetRegistrations,
  );
  method(ServiceWorkerContainer, "register", 1, containerRegister);
  method(
    ServiceWorkerContainer,
    "startMessages",
    0,
    containerStartMessages,
  );
  defineConstructorBacklink(
    ServiceWorkerContainer.prototype,
    ServiceWorkerContainer,
  );
  defineToStringTag(
    ServiceWorkerContainer.prototype,
    "ServiceWorkerContainer",
  );
}

function getter(constructor, name, operation) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return operation(this, name);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  definePrototypeGetter(constructor.prototype, name, descriptor.get);
}

function handler(constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return serviceWorkerHandler(this, name);
    },
    set [name](value) {
      setServiceWorkerHandler(this, name, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  registerNativeFunction(descriptor.set, `set ${name}`);
  definePrototypeAccessor(
    constructor.prototype,
    name,
    descriptor.get,
    descriptor.set,
  );
}

function method(constructor, name, length, operation) {
  const callback = {
    [name](...args) {
      return operation(this, ...args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(constructor.prototype, name, callback);
}
