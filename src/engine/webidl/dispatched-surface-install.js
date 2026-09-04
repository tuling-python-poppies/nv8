import {
  defineConstructorBacklink,
  defineGlobalConstructor,
  definePrototypeAccessor,
  definePrototypeGetter,
  definePrototypeMethod,
  defineToStringTag,
} from "./descriptor.js";
import {
  registerNativeFunction,
  registerNativeGetter,
} from "./native-function.js";

export function installDispatchedGlobal(
  Constructor,
  name = Constructor.name,
  resetPrototype = true,
) {
  if (resetPrototype) delete Constructor.prototype?.constructor;
  defineGlobalConstructor(name, Constructor);
}

export function installDispatchedRelation(
  Constructor,
  parentName,
  explicitParent = null,
) {
  if (
    typeof parentName !== "string"
    || parentName === ""
    || parentName === "Object"
  ) return;
  const Parent = explicitParent ?? globalThis[parentName];
  if (typeof Parent !== "function") {
    throw new TypeError(`Missing parent constructor ${parentName}`);
  }
  Object.setPrototypeOf(Constructor.prototype, Parent.prototype);
  Object.setPrototypeOf(Constructor, Parent);
}

export function installDispatchedAccessor(
  Constructor,
  name,
  read,
  write = null,
  writable = false,
) {
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      return read(this, name);
    },
    set [name](value) {
      return write(this, name, value);
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  if (writable && typeof write === "function") {
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

export function installDispatchedMethod(
  Constructor,
  name,
  length,
  operation,
) {
  const callback = {
    [name](...args) {
      return operation(this, name, args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  definePrototypeMethod(Constructor.prototype, name, callback);
}

export function installDirectMethod(Constructor, name, callback) {
  definePrototypeMethod(Constructor.prototype, name, callback);
}

export function installDispatchedConstructorBacklink(Constructor) {
  defineConstructorBacklink(Constructor.prototype, Constructor);
}

export function installDispatchedTag(Constructor, value = Constructor.name) {
  defineToStringTag(Constructor.prototype, value);
}

export function installDispatchedConstant(Constructor, name, value) {
  Object.defineProperty(Constructor, name, {
    value,
    writable: false,
    enumerable: true,
    configurable: false,
  });
  Object.defineProperty(Constructor.prototype, name, {
    value,
    writable: false,
    enumerable: true,
    configurable: false,
  });
}

export function installDispatchedIterator(
  Constructor,
  name,
  operation,
) {
  const callback = {
    [name]() {
      return operation(this);
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

export function installDispatchedIteratorAlias(Constructor, name) {
  const callback = Object.getOwnPropertyDescriptor(
    Constructor.prototype,
    name,
  )?.value;
  if (typeof callback !== "function") {
    throw new TypeError(
      `Missing iterator method ${Constructor.name}.prototype.${name}`,
    );
  }
  Object.defineProperty(Constructor.prototype, Symbol.iterator, {
    value: callback,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

export function installDispatchedStaticMethod(
  Constructor,
  name,
  operation,
  length,
) {
  const callback = {
    [name](...args) {
      return operation(...args);
    },
  }[name];
  Object.defineProperty(callback, "length", {
    value: length,
    configurable: true,
  });
  registerNativeFunction(callback, name);
  Object.defineProperty(Constructor, name, {
    value: callback,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}

export function installDispatchedGlobalGetter(
  name,
  factory,
  cacheValue = false,
) {
  const cached = cacheValue ? factory() : undefined;
  const descriptor = Object.getOwnPropertyDescriptor({
    get [name]() {
      if (!cacheValue) return factory();
      return cached;
    },
  }, name);
  registerNativeGetter(descriptor.get, name);
  Object.defineProperty(globalThis, name, {
    get: descriptor.get,
    enumerable: true,
    configurable: true,
  });
}
