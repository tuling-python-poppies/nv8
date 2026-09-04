import { Event } from "../event/event-constructor.js";
import * as runtime from "./input-events-runtime.js";
import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "../../../engine/webidl/descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "../../../engine/webidl/native-function.js";

const constructors = Object.freeze(Object.fromEntries(
  runtime.inputEventConstructors.map(Constructor => [
    Constructor.name,
    Constructor,
  ]),
));
const settable = new Set(["dropEffect", "effectAllowed"]);
const constants = Object.freeze({
  DOM_DELTA_PIXEL: 0,
  DOM_DELTA_LINE: 1,
  DOM_DELTA_PAGE: 2,
  DOM_KEY_LOCATION_STANDARD: 0,
  DOM_KEY_LOCATION_LEFT: 1,
  DOM_KEY_LOCATION_RIGHT: 2,
  DOM_KEY_LOCATION_NUMPAD: 3,
});

export function installInputEventGlobal(Constructor) {
  delete Constructor.prototype.constructor;
  defineGlobalConstructor(Constructor.name, Constructor);
}

export function installInputEventRelation(Constructor, surface) {
  const parent = constructors[surface.prototypeParent]
    ?? (surface.prototypeParent === "Event" ? Event : null);
  if (parent === null) return;
  Object.setPrototypeOf(Constructor.prototype, parent.prototype);
  Object.setPrototypeOf(Constructor, parent);
}

export function installInputEventAccessor(Constructor, name) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return runtime.inputEventProperty(this, name);
    },
    set [name](value) {
      runtime.setInputEventProperty(this, name, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  if (settable.has(name)) {
    registerNativeFunction(descriptor.set, `set ${name}`);
    definePrototypeAccessor(
      Constructor.prototype,
      name,
      descriptor.get,
      descriptor.set,
    );
    return;
  }
  definePrototypeGetter(Constructor.prototype, name, descriptor.get);
}

export function installInputEventMethod(Constructor, name, length) {
  const callback = {
    [name](...args) {
      return runtime.inputEventOperation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}

export function installInputEventConstant(Constructor, name) {
  Object.defineProperty(Constructor, name, {
    value: constants[name],
    writable: false,
    enumerable: true,
    configurable: false,
  });
  Object.defineProperty(Constructor.prototype, name, {
    value: constants[name],
    writable: false,
    enumerable: true,
    configurable: false,
  });
}

export function installInputEventConstructorBacklink(Constructor) {
  defineConstructorBacklink(Constructor.prototype, Constructor);
}

export function installInputEventTag(Constructor) {
  defineToStringTag(Constructor.prototype, Constructor.name);
}

export function installInputEventIterator(Constructor, name) {
  const callback = {
    [name]() {
      return runtime.inputEventIterator(this);
    },
  }[name];
  registerNativeFunction(callback, name);
  Object.defineProperty(Constructor.prototype, Symbol.iterator, {
    value: callback,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}
