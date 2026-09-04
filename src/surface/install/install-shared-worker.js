import { EventTarget } from "../api/event/event-target-constructor.js";
import {
  SharedWorker,
  setSharedWorkerHandler,
  sharedWorkerHandler,
  sharedWorkerPort,
} from "../api/worker/shared-worker-runtime.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeAccessor,
  definePrototypeGetter,
  defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../engine/webidl/native-function.js";

export function installSharedWorker() {
  Object.setPrototypeOf(SharedWorker.prototype, EventTarget.prototype);
  Object.setPrototypeOf(SharedWorker, EventTarget);
  delete SharedWorker.prototype.constructor;
  defineGlobalConstructor("SharedWorker", SharedWorker);
  const port = Object.getOwnPropertyDescriptor({
    get port() {
      return sharedWorkerPort(this);
    },
  }, "port").get;
  registerNativeGetter(port, "port");
  definePrototypeGetter(SharedWorker.prototype, "port", port);
  defineConstructorBacklink(SharedWorker.prototype, SharedWorker);
  const descriptor = Object.getOwnPropertyDescriptor({
    get onerror() {
      return sharedWorkerHandler(this, "onerror");
    },
    set onerror(value) {
      setSharedWorkerHandler(this, "onerror", value);
    },
  }, "onerror");
  registerNativeGetter(descriptor.get, "onerror");
  registerNativeFunction(descriptor.set, "set onerror");
  definePrototypeAccessor(
    SharedWorker.prototype,
    "onerror",
    descriptor.get,
    descriptor.set,
  );
  defineToStringTag(SharedWorker.prototype, "SharedWorker");
}
