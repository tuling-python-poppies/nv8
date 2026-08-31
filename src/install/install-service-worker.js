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
} from "../webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../webidl/native-function.js";

export function installServiceWorker() {
  do {
    Object.setPrototypeOf(((([
    ServiceWorker,
    ServiceWorkerRegistration,
    ServiceWorkerContainer,
  ])[0])).prototype, EventTarget.prototype);
    Object.setPrototypeOf(((([
    ServiceWorker,
    ServiceWorkerRegistration,
    ServiceWorkerContainer,
  ])[0])), EventTarget);
    delete ((([
    ServiceWorker,
    ServiceWorkerRegistration,
    ServiceWorkerContainer,
  ])[0])).prototype.constructor;
    defineGlobalConstructor(((([
    ServiceWorker,
    ServiceWorkerRegistration,
    ServiceWorkerContainer,
  ])[0])).name, ((([
    ServiceWorker,
    ServiceWorkerRegistration,
    ServiceWorkerContainer,
  ])[0])));
  } while (false);
do {
    Object.setPrototypeOf(((([
    ServiceWorker,
    ServiceWorkerRegistration,
    ServiceWorkerContainer,
  ])[1])).prototype, EventTarget.prototype);
    Object.setPrototypeOf(((([
    ServiceWorker,
    ServiceWorkerRegistration,
    ServiceWorkerContainer,
  ])[1])), EventTarget);
    delete ((([
    ServiceWorker,
    ServiceWorkerRegistration,
    ServiceWorkerContainer,
  ])[1])).prototype.constructor;
    defineGlobalConstructor(((([
    ServiceWorker,
    ServiceWorkerRegistration,
    ServiceWorkerContainer,
  ])[1])).name, ((([
    ServiceWorker,
    ServiceWorkerRegistration,
    ServiceWorkerContainer,
  ])[1])));
  } while (false);
do {
    Object.setPrototypeOf(((([
    ServiceWorker,
    ServiceWorkerRegistration,
    ServiceWorkerContainer,
  ])[2])).prototype, EventTarget.prototype);
    Object.setPrototypeOf(((([
    ServiceWorker,
    ServiceWorkerRegistration,
    ServiceWorkerContainer,
  ])[2])), EventTarget);
    delete ((([
    ServiceWorker,
    ServiceWorkerRegistration,
    ServiceWorkerContainer,
  ])[2])).prototype.constructor;
    defineGlobalConstructor(((([
    ServiceWorker,
    ServiceWorkerRegistration,
    ServiceWorkerContainer,
  ])[2])).name, ((([
    ServiceWorker,
    ServiceWorkerRegistration,
    ServiceWorkerContainer,
  ])[2])));
  } while (false);
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
  do {getter(ServiceWorkerRegistration, ("installing"), registrationProperty);} while (false);
do {getter(ServiceWorkerRegistration, ("waiting"), registrationProperty);} while (false);
do {getter(ServiceWorkerRegistration, ("active"), registrationProperty);} while (false);
do {getter(ServiceWorkerRegistration, ("navigationPreload"), registrationProperty);} while (false);
do {getter(ServiceWorkerRegistration, ("scope"), registrationProperty);} while (false);
do {getter(ServiceWorkerRegistration, ("updateViaCache"), registrationProperty);} while (false);
  handler(ServiceWorkerRegistration, "onupdatefound");
  method(
    ServiceWorkerRegistration,
    "unregister",
    0,
    registrationUnregister,
  );
  method(ServiceWorkerRegistration, "update", 0, registrationUpdate);
  do {getter(ServiceWorkerRegistration, ("paymentManager"), registrationProperty);} while (false);
  defineConstructorBacklink(
    ServiceWorkerRegistration.prototype,
    ServiceWorkerRegistration,
  );
  do {getter(ServiceWorkerRegistration, ("backgroundFetch"), registrationProperty);} while (false);
do {getter(ServiceWorkerRegistration, ("periodicSync"), registrationProperty);} while (false);
do {getter(ServiceWorkerRegistration, ("sync"), registrationProperty);} while (false);
do {getter(ServiceWorkerRegistration, ("cookies"), registrationProperty);} while (false);
do {getter(ServiceWorkerRegistration, ("pushManager"), registrationProperty);} while (false);
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
