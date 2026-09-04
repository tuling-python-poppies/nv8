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
  do {
    delete (((runtime.coordinationConstructors)[0])).prototype.constructor;
    defineGlobalConstructor((((runtime.coordinationConstructors)[0])).name, (((runtime.coordinationConstructors)[0])));
  } while (false);
do {
    delete (((runtime.coordinationConstructors)[1])).prototype.constructor;
    defineGlobalConstructor((((runtime.coordinationConstructors)[1])).name, (((runtime.coordinationConstructors)[1])));
  } while (false);
do {
    delete (((runtime.coordinationConstructors)[2])).prototype.constructor;
    defineGlobalConstructor((((runtime.coordinationConstructors)[2])).name, (((runtime.coordinationConstructors)[2])));
  } while (false);
do {
    delete (((runtime.coordinationConstructors)[3])).prototype.constructor;
    defineGlobalConstructor((((runtime.coordinationConstructors)[3])).name, (((runtime.coordinationConstructors)[3])));
  } while (false);
  Object.setPrototypeOf(runtime.WakeLockSentinel.prototype, EventTarget.prototype);
  Object.setPrototypeOf(runtime.WakeLockSentinel, EventTarget);
  do {
    {
  do {
    installAccessor((constructors[("Lock")]), ("name"));
  } while (false);
do {
    installAccessor((constructors[("Lock")]), ("mode"));
  } while (false);
do {
    defineConstructorBacklink((constructors[("Lock")]).prototype, (constructors[("Lock")]));
  } while (false);
do {
    defineToStringTag((constructors[("Lock")]).prototype, (constructors[("Lock")]).name);
  } while (false);
}
  } while (false);
do {
    {
  do {
    installMethod((constructors[("LockManager")]), ("query"), (0));
  } while (false);
do {
    installMethod((constructors[("LockManager")]), ("request"), (2));
  } while (false);
do {
    defineConstructorBacklink((constructors[("LockManager")]).prototype, (constructors[("LockManager")]));
  } while (false);
do {
    defineToStringTag((constructors[("LockManager")]).prototype, (constructors[("LockManager")]).name);
  } while (false);
}
  } while (false);
do {
    {
  do {
    installMethod((constructors[("WakeLock")]), ("request"), (0));
  } while (false);
do {
    defineConstructorBacklink((constructors[("WakeLock")]).prototype, (constructors[("WakeLock")]));
  } while (false);
do {
    defineToStringTag((constructors[("WakeLock")]).prototype, (constructors[("WakeLock")]).name);
  } while (false);
}
  } while (false);
do {
    {
  do {
    installAccessor((constructors[("WakeLockSentinel")]), ("onrelease"));
  } while (false);
do {
    installAccessor((constructors[("WakeLockSentinel")]), ("released"));
  } while (false);
do {
    installAccessor((constructors[("WakeLockSentinel")]), ("type"));
  } while (false);
do {
    installMethod((constructors[("WakeLockSentinel")]), ("release"), (0));
  } while (false);
do {
    defineConstructorBacklink((constructors[("WakeLockSentinel")]).prototype, (constructors[("WakeLockSentinel")]));
  } while (false);
do {
    defineToStringTag((constructors[("WakeLockSentinel")]).prototype, (constructors[("WakeLockSentinel")]).name);
  } while (false);
}
  } while (false);
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
