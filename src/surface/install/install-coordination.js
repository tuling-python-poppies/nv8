import { EventTarget } from "../api/event/event-target-constructor.js";
import * as runtime from "../api/coordination/coordination-runtime.js";
import { COORDINATION_SURFACES } from "../api/coordination/coordination-surface.js";
import {
  defineConstructorBacklink, defineGlobalConstructor, definePrototypeAccessor,
  definePrototypeGetter, definePrototypeMethod, defineToStringTag,
} from "../../engine/webidl/descriptor.js";
import {
  registerNativeFunction, registerNativeGetter,
} from "../../engine/webidl/native-function.js";

const constructors = Object.freeze(Object.fromEntries(
  runtime.coordinationConstructors.map(Constructor => [Constructor.name, Constructor]),
));

export function installCoordination() {

    delete runtime.coordinationConstructors[0].prototype.constructor;
    defineGlobalConstructor(runtime.coordinationConstructors[0].name, runtime.coordinationConstructors[0]);

    delete runtime.coordinationConstructors[1].prototype.constructor;
    defineGlobalConstructor(runtime.coordinationConstructors[1].name, runtime.coordinationConstructors[1]);

    delete runtime.coordinationConstructors[2].prototype.constructor;
    defineGlobalConstructor(runtime.coordinationConstructors[2].name, runtime.coordinationConstructors[2]);

    delete runtime.coordinationConstructors[3].prototype.constructor;
    defineGlobalConstructor(runtime.coordinationConstructors[3].name, runtime.coordinationConstructors[3]);

  Object.setPrototypeOf(runtime.WakeLockSentinel.prototype, EventTarget.prototype);
  Object.setPrototypeOf(runtime.WakeLockSentinel, EventTarget);

    {

    installAccessor(constructors["Lock"], "name");

    installAccessor(constructors["Lock"], "mode");

    defineConstructorBacklink(constructors["Lock"].prototype, constructors["Lock"]);

    defineToStringTag(constructors["Lock"].prototype, constructors["Lock"].name);

}

    {

    installMethod(constructors["LockManager"], "query", 0);

    installMethod(constructors["LockManager"], "request", 2);

    defineConstructorBacklink(constructors["LockManager"].prototype, constructors["LockManager"]);

    defineToStringTag(constructors["LockManager"].prototype, constructors["LockManager"].name);

}

    {

    installMethod(constructors["WakeLock"], "request", 0);

    defineConstructorBacklink(constructors["WakeLock"].prototype, constructors["WakeLock"]);

    defineToStringTag(constructors["WakeLock"].prototype, constructors["WakeLock"].name);

}

    {

    installAccessor(constructors["WakeLockSentinel"], "onrelease");

    installAccessor(constructors["WakeLockSentinel"], "released");

    installAccessor(constructors["WakeLockSentinel"], "type");

    installMethod(constructors["WakeLockSentinel"], "release", 0);

    defineConstructorBacklink(constructors["WakeLockSentinel"].prototype, constructors["WakeLockSentinel"]);

    defineToStringTag(constructors["WakeLockSentinel"].prototype, constructors["WakeLockSentinel"].name);

}

}

function installAccessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() { return runtime.coordinationProperty(this, name); },
    set [name](value) { runtime.setCoordinationProperty(this, name, value); },
  }, name);
  registerNativeGetter(descriptor.get, name);
  if (name === "onrelease") {
    registerNativeFunction(descriptor.set, "set onrelease");
    definePrototypeAccessor(Constructor.prototype, name, descriptor.get, descriptor.set);
  } else definePrototypeGetter(Constructor.prototype, name, descriptor.get);
}

function installMethod(Constructor, name, length) {
  const callback = { [name](...args) {
    return runtime.coordinationOperation(this, name, args);
  } }[name];
  Object.defineProperty(callback, "length", { value: length, configurable: true });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}
