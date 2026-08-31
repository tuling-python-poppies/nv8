import { AbortController } from "../api/abort/abort-controller-constructor.js";
import { AbortSignal } from "../api/abort/abort-signal-constructor.js";
import { Event } from "../api/event/event-constructor.js";
import { EventTarget } from "../api/event/event-target-constructor.js";
import * as runtime from "../api/scheduling/scheduling-runtime.js";
import { SCHEDULING_SURFACES } from "../api/scheduling/scheduling-surface.js";
import {
  defineConstructorBacklink, defineGlobalConstructor, defineGlobalFunction,
  definePrototypeAccessor, definePrototypeGetter, definePrototypeMethod,
  defineToStringTag,
} from "../webidl/descriptor.js";
import {
  registerNativeFunction, registerNativeGetter,
} from "../webidl/native-function.js";

const constructors = Object.freeze(Object.fromEntries(
  runtime.schedulingConstructors.map(Constructor => [Constructor.name, Constructor]),
));
const settable = new Set(["onchange", "onprioritychange"]);

export function installScheduling() {
  do {
    delete (((runtime.schedulingConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.schedulingConstructors)[0])).name, (((runtime.schedulingConstructors)[0])));
  } while (false);
do {
    delete (((runtime.schedulingConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.schedulingConstructors)[1])).name, (((runtime.schedulingConstructors)[1])));
  } while (false);
do {
    delete (((runtime.schedulingConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((runtime.schedulingConstructors)[2])).name, (((runtime.schedulingConstructors)[2])));
  } while (false);
do {
    delete (((runtime.schedulingConstructors)[3])).prototype.constructor;
    defineGlobalConstructor((((runtime.schedulingConstructors)[3])).name, (((runtime.schedulingConstructors)[3])));
  } while (false);
do {
    delete (((runtime.schedulingConstructors)[4])).prototype.constructor;
    defineGlobalConstructor((((runtime.schedulingConstructors)[4])).name, (((runtime.schedulingConstructors)[4])));
  } while (false);
do {
    delete (((runtime.schedulingConstructors)[5])).prototype.constructor;
    defineGlobalConstructor((((runtime.schedulingConstructors)[5])).name, (((runtime.schedulingConstructors)[5])));
  } while (false);
do {
    delete (((runtime.schedulingConstructors)[6])).prototype.constructor;
    defineGlobalConstructor((((runtime.schedulingConstructors)[6])).name, (((runtime.schedulingConstructors)[6])));
  } while (false);
do {
    delete (((runtime.schedulingConstructors)[7])).prototype.constructor;
    defineGlobalConstructor((((runtime.schedulingConstructors)[7])).name, (((runtime.schedulingConstructors)[7])));
  } while (false);
  const externalParents = { AbortController, AbortSignal, Event, EventTarget };
  do {
    const Constructor = constructors[("IdleDeadline")];
    const parent = constructors[(((((Object.entries(SCHEDULING_SURFACES))[0]))[1])).prototypeParent]
      ?? externalParents[(((((Object.entries(SCHEDULING_SURFACES))[0]))[1])).prototypeParent]
      ?? null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("IdleDetector")];
    const parent = constructors[(((((Object.entries(SCHEDULING_SURFACES))[1]))[1])).prototypeParent]
      ?? externalParents[(((((Object.entries(SCHEDULING_SURFACES))[1]))[1])).prototypeParent]
      ?? null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("Scheduling")];
    const parent = constructors[(((((Object.entries(SCHEDULING_SURFACES))[2]))[1])).prototypeParent]
      ?? externalParents[(((((Object.entries(SCHEDULING_SURFACES))[2]))[1])).prototypeParent]
      ?? null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("Scheduler")];
    const parent = constructors[(((((Object.entries(SCHEDULING_SURFACES))[3]))[1])).prototypeParent]
      ?? externalParents[(((((Object.entries(SCHEDULING_SURFACES))[3]))[1])).prototypeParent]
      ?? null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("TaskController")];
    const parent = constructors[(((((Object.entries(SCHEDULING_SURFACES))[4]))[1])).prototypeParent]
      ?? externalParents[(((((Object.entries(SCHEDULING_SURFACES))[4]))[1])).prototypeParent]
      ?? null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("TaskSignal")];
    const parent = constructors[(((((Object.entries(SCHEDULING_SURFACES))[5]))[1])).prototypeParent]
      ?? externalParents[(((((Object.entries(SCHEDULING_SURFACES))[5]))[1])).prototypeParent]
      ?? null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("TaskPriorityChangeEvent")];
    const parent = constructors[(((((Object.entries(SCHEDULING_SURFACES))[6]))[1])).prototypeParent]
      ?? externalParents[(((((Object.entries(SCHEDULING_SURFACES))[6]))[1])).prototypeParent]
      ?? null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
do {
    const Constructor = constructors[("UserActivation")];
    const parent = constructors[(((((Object.entries(SCHEDULING_SURFACES))[7]))[1])).prototypeParent]
      ?? externalParents[(((((Object.entries(SCHEDULING_SURFACES))[7]))[1])).prototypeParent]
      ?? null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  } while (false);
  do {
    {
  do {
    installAccessor((constructors[("IdleDeadline")]), ("didTimeout"));
  } while (false);
do {
    installMethod((constructors[("IdleDeadline")]), ("timeRemaining"), (0));
  } while (false);
do {
    defineConstructorBacklink((constructors[("IdleDeadline")]).prototype, (constructors[("IdleDeadline")]));
  } while (false);
do {
    defineToStringTag((constructors[("IdleDeadline")]).prototype, (constructors[("IdleDeadline")]).name);
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("IdleDetector")]), ("userState"));
  } while (false);
do {
    installAccessor((constructors[("IdleDetector")]), ("screenState"));
  } while (false);
do {
    installAccessor((constructors[("IdleDetector")]), ("onchange"));
  } while (false);
do {
    installMethod((constructors[("IdleDetector")]), ("start"), (0));
  } while (false);
do {
    defineConstructorBacklink((constructors[("IdleDetector")]).prototype, (constructors[("IdleDetector")]));
  } while (false);
do {
    defineToStringTag((constructors[("IdleDetector")]).prototype, (constructors[("IdleDetector")]).name);
  } while (false);
}
  } while (false);
do {
    {
  do {
    installMethod((constructors[("Scheduling")]), ("isInputPending"), (0));
  } while (false);
do {
    defineConstructorBacklink((constructors[("Scheduling")]).prototype, (constructors[("Scheduling")]));
  } while (false);
do {
    defineToStringTag((constructors[("Scheduling")]).prototype, (constructors[("Scheduling")]).name);
  } while (false);
}
  } while (false);
do {
    {
  do {
    installMethod((constructors[("Scheduler")]), ("postTask"), (1));
  } while (false);
do {
    installMethod((constructors[("Scheduler")]), ("yield"), (0));
  } while (false);
do {
    defineConstructorBacklink((constructors[("Scheduler")]).prototype, (constructors[("Scheduler")]));
  } while (false);
do {
    defineToStringTag((constructors[("Scheduler")]).prototype, (constructors[("Scheduler")]).name);
  } while (false);
}
  } while (false);
do {
    {
  do {
    installMethod((constructors[("TaskController")]), ("setPriority"), (1));
  } while (false);
do {
    defineConstructorBacklink((constructors[("TaskController")]).prototype, (constructors[("TaskController")]));
  } while (false);
do {
    defineToStringTag((constructors[("TaskController")]).prototype, (constructors[("TaskController")]).name);
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("TaskSignal")]), ("priority"));
  } while (false);
do {
    installAccessor((constructors[("TaskSignal")]), ("onprioritychange"));
  } while (false);
do {
    defineConstructorBacklink((constructors[("TaskSignal")]).prototype, (constructors[("TaskSignal")]));
  } while (false);
do {
    defineToStringTag((constructors[("TaskSignal")]).prototype, (constructors[("TaskSignal")]).name);
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("TaskPriorityChangeEvent")]), ("previousPriority"));
  } while (false);
do {
    defineConstructorBacklink((constructors[("TaskPriorityChangeEvent")]).prototype, (constructors[("TaskPriorityChangeEvent")]));
  } while (false);
do {
    defineToStringTag((constructors[("TaskPriorityChangeEvent")]).prototype, (constructors[("TaskPriorityChangeEvent")]).name);
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("UserActivation")]), ("hasBeenActive"));
  } while (false);
do {
    installAccessor((constructors[("UserActivation")]), ("isActive"));
  } while (false);
do {
    defineConstructorBacklink((constructors[("UserActivation")]).prototype, (constructors[("UserActivation")]));
  } while (false);
do {
    defineToStringTag((constructors[("UserActivation")]).prototype, (constructors[("UserActivation")]).name);
  } while (false);
}
  } while (false);
  defineStatic(runtime.IdleDetector, "requestPermission", 0, runtime.idlePermission);
  const descriptor = Object.getOwnPropertyDescriptor({
    get scheduler() { return runtime.createScheduler(); },
  }, "scheduler");
  registerNativeGetter(descriptor.get, "scheduler");
  Object.defineProperty(globalThis, "scheduler", {
    get: descriptor.get, enumerable: true, configurable: true,
  });
  defineGlobalFunction("requestIdleCallback", runtime.requestIdleCallback);
  defineGlobalFunction("cancelIdleCallback", runtime.cancelIdleCallback);
}


function installAccessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() { return runtime.schedulingProperty(this, name); },
    set [name](value) { runtime.setSchedulingProperty(this, name, value); },
  }, name);
  registerNativeGetter(descriptor.get, name);
  if (settable.has(name)) {
    registerNativeFunction(descriptor.set, `set ${name}`);
    definePrototypeAccessor(Constructor.prototype, name, descriptor.get, descriptor.set);
  } else definePrototypeGetter(Constructor.prototype, name, descriptor.get);
}
function installMethod(Constructor, name, length) {
  const callback = { [name](...args) {
    return runtime.schedulingOperation(this, name, args);
  } }[name];
  Object.defineProperty(callback, "length", { value: length, configurable: true });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}
function defineStatic(Constructor, name, length, implementation) {
  const callback = { [name](...args) { return implementation(...args); } }[name];
  Object.defineProperty(callback, "length", { value: length, configurable: true });
  registerNativeFunction(callback, name);
  Object.defineProperty(Constructor, name, {
    value: callback, writable: true, enumerable: true, configurable: true,
  });
}
