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
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction, registerNativeGetter,
} from "../../engine/webidl/native-function.js";

const constructors = Object.freeze(Object.fromEntries(
  runtime.schedulingConstructors.map(Constructor => [Constructor.name, Constructor]),
));
const settable = new Set(["onchange", "onprioritychange"]);

export function installScheduling() {

    delete runtime.schedulingConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.schedulingConstructors[0].name, runtime.schedulingConstructors[0]);

    delete runtime.schedulingConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.schedulingConstructors[1].name, runtime.schedulingConstructors[1]);

    delete runtime.schedulingConstructors[2].prototype.constructor;
    defineGlobalConstructor(runtime.schedulingConstructors[2].name, runtime.schedulingConstructors[2]);

    delete runtime.schedulingConstructors[3].prototype.constructor;
    defineGlobalConstructor(runtime.schedulingConstructors[3].name, runtime.schedulingConstructors[3]);

    delete runtime.schedulingConstructors[4].prototype.constructor;
    defineGlobalConstructor(runtime.schedulingConstructors[4].name, runtime.schedulingConstructors[4]);

    delete runtime.schedulingConstructors[5].prototype.constructor;
    defineGlobalConstructor(runtime.schedulingConstructors[5].name, runtime.schedulingConstructors[5]);

    delete runtime.schedulingConstructors[6].prototype.constructor;
    defineGlobalConstructor(runtime.schedulingConstructors[6].name, runtime.schedulingConstructors[6]);

    delete runtime.schedulingConstructors[7].prototype.constructor;
    defineGlobalConstructor(runtime.schedulingConstructors[7].name, runtime.schedulingConstructors[7]);

  const externalParents = { AbortController, AbortSignal, Event, EventTarget };
  {
    const Constructor = constructors["IdleDeadline"];
    const parent = constructors[(((((Object.entries(SCHEDULING_SURFACES))[0]))[1])).prototypeParent]
      ?? externalParents[(((((Object.entries(SCHEDULING_SURFACES))[0]))[1])).prototypeParent]
      ?? null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["IdleDetector"];
    const parent = constructors[(((((Object.entries(SCHEDULING_SURFACES))[1]))[1])).prototypeParent]
      ?? externalParents[(((((Object.entries(SCHEDULING_SURFACES))[1]))[1])).prototypeParent]
      ?? null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["Scheduling"];
    const parent = constructors[(((((Object.entries(SCHEDULING_SURFACES))[2]))[1])).prototypeParent]
      ?? externalParents[(((((Object.entries(SCHEDULING_SURFACES))[2]))[1])).prototypeParent]
      ?? null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["Scheduler"];
    const parent = constructors[(((((Object.entries(SCHEDULING_SURFACES))[3]))[1])).prototypeParent]
      ?? externalParents[(((((Object.entries(SCHEDULING_SURFACES))[3]))[1])).prototypeParent]
      ?? null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["TaskController"];
    const parent = constructors[(((((Object.entries(SCHEDULING_SURFACES))[4]))[1])).prototypeParent]
      ?? externalParents[(((((Object.entries(SCHEDULING_SURFACES))[4]))[1])).prototypeParent]
      ?? null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["TaskSignal"];
    const parent = constructors[(((((Object.entries(SCHEDULING_SURFACES))[5]))[1])).prototypeParent]
      ?? externalParents[(((((Object.entries(SCHEDULING_SURFACES))[5]))[1])).prototypeParent]
      ?? null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["TaskPriorityChangeEvent"];
    const parent = constructors[(((((Object.entries(SCHEDULING_SURFACES))[6]))[1])).prototypeParent]
      ?? externalParents[(((((Object.entries(SCHEDULING_SURFACES))[6]))[1])).prototypeParent]
      ?? null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }
{
    const Constructor = constructors["UserActivation"];
    const parent = constructors[(((((Object.entries(SCHEDULING_SURFACES))[7]))[1])).prototypeParent]
      ?? externalParents[(((((Object.entries(SCHEDULING_SURFACES))[7]))[1])).prototypeParent]
      ?? null;
    if (parent !== null) {
      Object.setPrototypeOf(Constructor.prototype, parent.prototype);
      Object.setPrototypeOf(Constructor, parent);
    }
  }

    {

    installAccessor(constructors["IdleDeadline"], "didTimeout");

    installMethod(constructors["IdleDeadline"], "timeRemaining", 0);

    defineConstructorBacklink(constructors["IdleDeadline"].prototype, constructors["IdleDeadline"]);

    defineToStringTag(constructors["IdleDeadline"].prototype, constructors["IdleDeadline"].name);

}

    {

    installAccessor(constructors["IdleDetector"], "userState");

    installAccessor(constructors["IdleDetector"], "screenState");

    installAccessor(constructors["IdleDetector"], "onchange");

    installMethod(constructors["IdleDetector"], "start", 0);

    defineConstructorBacklink(constructors["IdleDetector"].prototype, constructors["IdleDetector"]);

    defineToStringTag(constructors["IdleDetector"].prototype, constructors["IdleDetector"].name);

}

    {

    installMethod(constructors["Scheduling"], "isInputPending", 0);

    defineConstructorBacklink(constructors["Scheduling"].prototype, constructors["Scheduling"]);

    defineToStringTag(constructors["Scheduling"].prototype, constructors["Scheduling"].name);

}

    {

    installMethod(constructors["Scheduler"], "postTask", 1);

    installMethod(constructors["Scheduler"], "yield", 0);

    defineConstructorBacklink(constructors["Scheduler"].prototype, constructors["Scheduler"]);

    defineToStringTag(constructors["Scheduler"].prototype, constructors["Scheduler"].name);

}

    {

    installMethod(constructors["TaskController"], "setPriority", 1);

    defineConstructorBacklink(constructors["TaskController"].prototype, constructors["TaskController"]);

    defineToStringTag(constructors["TaskController"].prototype, constructors["TaskController"].name);

}

    {

    installAccessor(constructors["TaskSignal"], "priority");

    installAccessor(constructors["TaskSignal"], "onprioritychange");

    defineConstructorBacklink(constructors["TaskSignal"].prototype, constructors["TaskSignal"]);

    defineToStringTag(constructors["TaskSignal"].prototype, constructors["TaskSignal"].name);

}

    {

    installAccessor(constructors["TaskPriorityChangeEvent"], "previousPriority");

    defineConstructorBacklink(constructors["TaskPriorityChangeEvent"].prototype, constructors["TaskPriorityChangeEvent"]);

    defineToStringTag(constructors["TaskPriorityChangeEvent"].prototype, constructors["TaskPriorityChangeEvent"].name);

}

    {

    installAccessor(constructors["UserActivation"], "hasBeenActive");

    installAccessor(constructors["UserActivation"], "isActive");

    defineConstructorBacklink(constructors["UserActivation"].prototype, constructors["UserActivation"]);

    defineToStringTag(constructors["UserActivation"].prototype, constructors["UserActivation"].name);

}

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
