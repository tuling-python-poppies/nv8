import { EventTarget } from "../api/event/event-target-constructor.js";
import {
  Worker,
  setWorkerHandler,
  workerHandler,
  workerPostMessage,
  workerTerminate,
} from "../api/worker/worker-runtime.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeAccessor,
  definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../webidl/native-function.js";

export function installWorker() {
  Object.setPrototypeOf(Worker.prototype, EventTarget.prototype);
  Object.setPrototypeOf(Worker, EventTarget);
  delete Worker.prototype.constructor;
  defineGlobalConstructor("Worker", Worker);
  installHandler("onmessage");
  const postMessage = {
    postMessage(message) {
      return workerPostMessage(this, message, arguments[1]);
    },
  }.postMessage;
  Object.defineProperty(postMessage, "length", {
    value: 1,
    configurable: true,
  });
  registerNativeFunction(postMessage, "postMessage");
  definePrototypeMethod(Worker.prototype, "postMessage", postMessage);
  const terminate = {
    terminate() {
      return workerTerminate(this);
    },
  }.terminate;
  registerNativeFunction(terminate, "terminate");
  definePrototypeMethod(Worker.prototype, "terminate", terminate);
  defineConstructorBacklink(Worker.prototype, Worker);
  installHandler("onerror");
  defineToStringTag(Worker.prototype, "Worker");
}

function installHandler(name) {
    const descriptor = Object.getOwnPropertyDescriptor({
      get [name]() {
        return workerHandler(this, name);
      },
      set [name](value) {
        setWorkerHandler(this, name, value);
      },
    }, name);
    registerNativeGetter(descriptor.get, name);
    registerNativeFunction(descriptor.set, `set ${name}`);
    definePrototypeAccessor(
      Worker.prototype,
      name,
      descriptor.get,
      descriptor.set,
    );
}
