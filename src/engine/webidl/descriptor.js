import {
  findCrossRealmPrototypeAccessor,
  findCrossRealmPrototypeMethod,
} from "./cross-realm-method.js";
import { requireArguments } from "./conversions.js";
import {
  createNativeFunction,
  registerNativeFunctionImplementation,
  registerNativeFunction,
  registerNativeGetter,
} from "./native-function.js";

export function defineGlobalConstructor(name, constructor) {
  const prototypeDescriptor = Object.getOwnPropertyDescriptor(
    constructor,
    "prototype",
  );
  if (prototypeDescriptor !== undefined && prototypeDescriptor.writable) {
    Object.defineProperty(constructor, "prototype", {
      writable: false,
    });
  }
  Object.defineProperty(globalThis, name, {
    value: constructor,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

/**
 * 安装一个全局函数（`atob` / `btoa` / `structuredClone` 这类）。
 *
 * 实参个数检查与原型方法同一套规则，只是接口名固定为 `Window`。
 * 真实 Edge 实测：
 *
 * ```
 * atob()  → Failed to execute 'atob' on 'Window': 1 argument required, but only 0 present.
 * ```
 *
 * 迁移前这些全局函数各自手写文案，都是截断的
 * `Failed to execute 'atob': 1 argument required.`——既没有 `on 'Window'`，
 * 也没有 `, but only N present.`。
 *
 * @param {string} name
 * @param {Function} callback
 * @returns {Function}
 */
export function defineGlobalFunction(name, callback) {
  const required = callback.length;
  const guarded = required === 0 ? callback : function (...args) {
    requireArguments(required, args.length, name, "Window");
    return Reflect.apply(callback, this, args);
  };
  const installedCallback = createNativeFunction(
    name,
    required,
    guarded,
  );
  Object.defineProperty(globalThis, name, {
    value: installedCallback,
    writable: true,
    enumerable: true,
    configurable: true,
  });
  return installedCallback;
}

export function defineStaticMethod(
  constructor,
  name,
  callback,
  length = callback.length,
) {
  const installedCallback = createNativeFunction(name, length, callback);
  Object.defineProperty(constructor, name, {
    value: installedCallback,
    writable: true,
    enumerable: true,
    configurable: true,
  });
  return installedCallback;
}

export function definePrototypeMethod(
  prototype,
  name,
  callback,
  displayName = name,
  enumerable = true,
) {
  const installedCallback = createCrossRealmMethod(
    name,
    callback,
    displayName,
    prototype,
  );
  Object.defineProperty(prototype, name, {
    value: installedCallback,
    writable: true,
    enumerable,
    configurable: true,
  });
  return installedCallback;
}

export function definePrototypeGetter(prototype, name, getter) {
  const installedGetter = createCrossRealmGetter(name, getter);
  Object.defineProperty(prototype, name, {
    get: installedGetter,
    enumerable: true,
    configurable: true,
  });
  return installedGetter;
}

export function definePrototypeAccessor(prototype, name, getter, setter) {
  const installedGetter = createCrossRealmGetter(name, getter);
  const installedSetter = createCrossRealmSetter(name, setter);
  Object.defineProperty(prototype, name, {
    get: installedGetter,
    set: installedSetter,
    enumerable: true,
    configurable: true,
  });
  return {
    get: installedGetter,
    set: installedSetter,
  };
}

export function definePrototypeSetter(prototype, name, setter) {
  const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
  if (descriptor === undefined || typeof descriptor.get !== "function") {
    throw new TypeError(`Missing prototype getter ${String(name)}`);
  }
  const installedSetter = createCrossRealmSetter(name, setter);
  Object.defineProperty(prototype, name, {
    get: descriptor.get,
    set: installedSetter,
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable,
  });
  return installedSetter;
}

export function defineToStringTag(prototype, value) {
  Object.defineProperty(prototype, Symbol.toStringTag, {
    value,
    writable: false,
    enumerable: false,
    configurable: true,
  });
}

export function defineConstructorBacklink(prototype, constructor) {
  Object.defineProperty(prototype, "constructor", {
    value: constructor,
    writable: true,
    enumerable: false,
    configurable: true,
  });
}

/**
 * 不做**同步**实参个数检查的方法。
 *
 * 两类，都来自对真实 Edge 的实测（非推断）：
 *
 * 1. **返回 Promise 的操作**。WebIDL 规定这类操作的参数错误转为
 *    **rejected promise**，不同步抛。实测真实 Edge 对
 *    `document.hasPrivateToken()` 不抛错。
 * 2. **自己做参数校验的迭代辅助方法**。`forEach` 类报的是
 *    `undefined is not a function`，而不是 WebIDL 的 arity 模板。
 *
 * 键可以是裸方法名（对所有接口生效）或 `Interface.method`。
 */
const NO_SYNC_ARITY_CHECK = new Set([
  // 迭代辅助里只有 DOMTokenList.forEach 是 JS 风格报错。
  // 实测 `URLSearchParams.forEach` / `Headers.forEach` 反而走 WebIDL arity
  // 模板——所以不能按裸方法名一刀切排除。
  "DOMTokenList.forEach",
  // 返回 Promise 的操作：实测不同步抛
  "Document.requestStorageAccessFor",
  "Document.hasPrivateToken",
  "Document.hasRedemptionRecord",
]);

/**
 * 推断声明该方法的接口名，用于 WebIDL 报错文案。
 *
 * 真实 Chromium 的文案用的是**声明方法的接口**，而不是实际接收者：
 * 在 document 上调 `addEventListener` 报的仍是 `on 'EventTarget'`。因此取
 * 安装目标原型的名字。
 *
 * **延迟解析**：`Symbol.toStringTag` 与 `constructor` 回链都是在方法安装
 * 之后才装上的（`finishXToStringTag` / `defineConstructorBacklink`），
 * 安装时取不到。所以等到真正要报错时再解析并缓存。
 *
 * @param {object} prototype
 * @returns {string|null}
 */
function resolveInterfaceName(prototype) {
  try {
    const tag = prototype[Symbol.toStringTag];
    if (typeof tag === "string" && tag !== "") return tag;
    const constructor = prototype.constructor;
    if (typeof constructor === "function" && constructor.name !== "") {
      return constructor.name;
    }
  } catch {
    // 访问器抩错就当推断不出来
  }
  return null;
}

function createCrossRealmMethod(name, callback, displayName, prototype = null) {
  let installedCallback;
  let interfaceName;
  // WebIDL 里方法的 `length` 就是**必需参数个数**（可选参数不计入）。
  // 实测对比真实 Edge：3476 个方法的 length 全部一致，所以它是可靠的
  // 必需参数信息源——不需要在 757 个调用点逐个手写个数。
  const required = callback.length;
  const checkArity = required > 0
    && prototype !== null
    && !NO_SYNC_ARITY_CHECK.has(name);
  const invoke = (receiver, args) => {
    if (checkArity && args.length < required) {
      if (interfaceName === undefined) {
        interfaceName = resolveInterfaceName(prototype);
      }
      if (
        interfaceName !== null
        && !NO_SYNC_ARITY_CHECK.has(`${interfaceName}.${name}`)
      ) {
        requireArguments(required, args.length, displayName, interfaceName);
      }
    }
    const foreignMethod = findCrossRealmPrototypeMethod(
      receiver,
      name,
      installedCallback,
    );
    if (foreignMethod !== null) {
      return Reflect.apply(foreignMethod, receiver, args);
    }
    return Reflect.apply(callback, receiver, args);
  };
  installedCallback = {
    call(...args) {
      return invoke(this, args);
    },
  }.call;
  Object.defineProperty(installedCallback, "name", {
    value: displayName,
    configurable: true,
  });
  Object.defineProperty(installedCallback, "length", {
    value: callback.length,
    configurable: true,
  });
  registerNativeFunction(installedCallback, displayName);
  registerNativeFunctionImplementation(installedCallback, callback);
  return installedCallback;
}

function createCrossRealmGetter(name, getter) {
  let installedGetter;
  const invoke = receiver => {
    const foreignGetter = findCrossRealmPrototypeAccessor(
      receiver,
      name,
      "get",
      installedGetter,
    );
    if (foreignGetter !== null) {
      return Reflect.apply(foreignGetter, receiver, []);
    }
    return Reflect.apply(getter, receiver, []);
  };
  installedGetter = Object.getOwnPropertyDescriptor({
    get value() {
      return invoke(this);
    },
  }, "value").get;
  registerNativeGetter(installedGetter, name);
  registerNativeFunctionImplementation(installedGetter, getter);
  return installedGetter;
}

function createCrossRealmSetter(name, setter) {
  let installedSetter;
  const invoke = (receiver, value) => {
    const foreignSetter = findCrossRealmPrototypeAccessor(
      receiver,
      name,
      "set",
      installedSetter,
    );
    if (foreignSetter !== null) {
      return Reflect.apply(foreignSetter, receiver, [value]);
    }
    return Reflect.apply(setter, receiver, [value]);
  };
  installedSetter = Object.getOwnPropertyDescriptor({
    set value(value) {
      invoke(this, value);
    },
  }, "value").set;
  Object.defineProperty(installedSetter, "name", {
    value: `set ${name}`,
    configurable: true,
  });
  registerNativeFunction(installedSetter, `set ${name}`);
  registerNativeFunctionImplementation(installedSetter, setter);
  return installedSetter;
}
