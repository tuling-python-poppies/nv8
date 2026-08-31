/**
 * Web IDL Foundation Plugin - 生产版本
 * 
 * 提供 Web IDL 规范的基础工具和原生函数注册机制。
 * 这是所有其他插件的基础依赖。
 * 
 * 提供的能力：
 * - webidl-primitives: 基础类型检查和转换
 * - webidl-descriptors: 属性描述符工具
 * - native-function-registry: 原生函数注册和 toString 模拟
 * 
 * 依赖：无（最底层插件）
 */

import { definePlugin } from '../../core/plugin-sdk/define-plugin.js';

export default definePlugin({
  id: 'webidl-foundation',
  version: '1.0.0',
  
  description: 'Web IDL 基础工具和原生函数注册机制',
  
  // 不依赖其他插件
  requires: [],
  
  // 提供三个核心能力
  provides: [
    { 
      name: 'webidl-primitives', 
      version: '1.0.0',
      description: 'Web IDL 类型转换和检查函数'
    },
    { 
      name: 'webidl-descriptors', 
      version: '1.0.0',
      description: 'Web IDL 属性描述符定义工具'
    },
    { 
      name: 'native-function-registry', 
      version: '1.0.0',
      description: '原生函数注册和 Function.prototype.toString 模拟'
    },
  ],
  
  // 支持所有 realm 类型
  supports: {
    realms: ['root', 'iframe', 'worker'],
  },
  
  install(context) {
    const { realm, state, trace } = context;
    
    trace('Installing webidl-foundation...');
    
    // 1. 创建或获取跨 realm 的 native function registry
    let registry = state.get('native-function-registry', 'sandbox');
    
    if (!registry) {
      trace('Creating native function registry');
      registry = createNativeFunctionRegistry();
      state.set('native-function-registry', registry, 'sandbox');
    }
    
    // 2. 在当前 realm 安装 Function.prototype.toString 拦截
    trace('Installing Function.prototype.toString override');
    installNativeFunctionToString(registry, realm);
    
    // 3. 创建 WebIDL 工具集
    const webidlTools = createWebIDLTools(registry, trace);
    
    // 4. 暴露 API 到插件上下文
    context.exports = {
      // Native function registry (跨 realm 共享)
      registry,
      
      // WebIDL 工具 (当前 realm)
      ...webidlTools,
    };
    
    trace('webidl-foundation installed successfully');
  },
});

/**
 * 创建原生函数注册表
 * 跨 realm 共享，用于 Function.prototype.toString 查找
 */
function createNativeFunctionRegistry() {
  const sources = new Map();
  const implementations = new Map();
  const registered = new Set();
  
  return {
    // 注册普通函数
    register(callback, source) {
      sources.set(callback, source);
      registered.add(callback);
    },
    
    // 检查是否已注册
    has(callback) {
      return registered.has(callback);
    },
    
    // 获取源码
    source(callback) {
      return sources.get(callback);
    },
    
    // 注册实现（用于跨 realm 调用检测）
    registerImplementation(callback, implementation) {
      implementations.set(callback, implementation);
    },
    
    // 检查实现
    isLocalImplementation(callback, implementation) {
      return implementations.get(callback) === implementation;
    },
    
    // 清理
    clear() {
      sources.clear();
      implementations.clear();
      registered.clear();
    },
  };
}

/**
 * 安装 Function.prototype.toString 拦截
 */
function installNativeFunctionToString(registry, realm) {
  const globalThis = realm.global;
  const originalToString = Function.prototype.toString;
  
  // 检查是否已经安装过
  if (realm.global.__nv8_toString_installed__) {
    return;
  }
  
  const invoke = function(receiver) {
    // 先检查本地注册
    const source = registry.source(receiver);
    if (source !== undefined) {
      return source;
    }
    
    // 回退到原生 toString
    return Reflect.apply(originalToString, receiver, []);
  };
  
  const toString = {
    call() {
      return invoke(this);
    },
  }.call;
  
  Object.defineProperty(toString, 'name', {
    value: 'toString',
    configurable: true,
  });
  
  // 注册 toString 本身为 native function
  registry.register(toString, 'function toString() { [native code] }');
  
  // 安装到 Function.prototype
  Object.defineProperty(Function.prototype, 'toString', {
    value: toString,
    writable: true,
    enumerable: false,
    configurable: true,
  });
  
  // 标记已安装
  realm.global.__nv8_toString_installed__ = true;
}

/**
 * 创建 WebIDL 工具集
 */
function createWebIDLTools(registry, trace) {
  return {
    // ============================================================
    // Native Function 注册工具
    // ============================================================
    
    registerNativeFunction(callback, displayName) {
      const source = `function ${displayName}() { [native code] }`;
      registry.register(callback, source);
      return callback;
    },
    
    registerNativeGetter(callback, propertyName) {
      Object.defineProperty(callback, 'name', {
        value: `get ${propertyName}`,
        configurable: true,
      });
      const source = `function get ${propertyName}() { [native code] }`;
      registry.register(callback, source);
      return callback;
    },
    
    registerNativeSetter(callback, propertyName) {
      Object.defineProperty(callback, 'name', {
        value: `set ${propertyName}`,
        configurable: true,
      });
      const source = `function set ${propertyName}() { [native code] }`;
      registry.register(callback, source);
      return callback;
    },
    
    createNativeFunction(name, length, implementation, displayName = name) {
      const invoke = (receiver, args) =>
        Reflect.apply(implementation, receiver, args);
      
      const callback = {
        call(...args) {
          return invoke(this, args);
        },
      }.call;
      
      Object.defineProperty(callback, 'name', {
        value: name,
        configurable: true,
      });
      
      Object.defineProperty(callback, 'length', {
        value: length,
        configurable: true,
      });
      
      const source = `function ${displayName}() { [native code] }`;
      registry.register(callback, source);
      registry.registerImplementation(callback, implementation);
      
      return callback;
    },
    
    // ============================================================
    // 属性描述符工具
    // ============================================================
    
    defineGlobalConstructor(name, constructor) {
      const prototypeDescriptor = Object.getOwnPropertyDescriptor(
        constructor,
        'prototype'
      );
      
      if (prototypeDescriptor !== undefined && prototypeDescriptor.writable) {
        Object.defineProperty(constructor, 'prototype', {
          writable: false,
        });
      }
      
      Object.defineProperty(globalThis, name, {
        value: constructor,
        writable: true,
        enumerable: false,
        configurable: true,
      });
      
      trace(`Defined global constructor: ${name}`);
    },
    
    defineGlobalFunction(name, callback) {
      const installedCallback = this.createNativeFunction(
        name,
        callback.length,
        callback
      );
      
      Object.defineProperty(globalThis, name, {
        value: installedCallback,
        writable: true,
        enumerable: true,
        configurable: true,
      });
      
      trace(`Defined global function: ${name}`);
      return installedCallback;
    },
    
    defineStaticMethod(constructor, name, callback, length = callback.length) {
      const installedCallback = this.createNativeFunction(
        name,
        length,
        callback
      );
      
      Object.defineProperty(constructor, name, {
        value: installedCallback,
        writable: true,
        enumerable: true,
        configurable: true,
      });
      
      return installedCallback;
    },
    
    definePrototypeMethod(prototype, name, callback, displayName = name, enumerable = true) {
      const installedCallback = this.createCrossRealmMethod(
        name,
        callback,
        displayName,
        registry
      );
      
      Object.defineProperty(prototype, name, {
        value: installedCallback,
        writable: true,
        enumerable,
        configurable: true,
      });
      
      return installedCallback;
    },
    
    definePrototypeGetter(prototype, name, getter) {
      const installedGetter = this.createCrossRealmGetter(
        name,
        getter,
        registry
      );
      
      Object.defineProperty(prototype, name, {
        get: installedGetter,
        enumerable: true,
        configurable: true,
      });
      
      return installedGetter;
    },
    
    definePrototypeAccessor(prototype, name, getter, setter) {
      const installedGetter = this.createCrossRealmGetter(name, getter, registry);
      const installedSetter = this.createCrossRealmSetter(name, setter, registry);
      
      Object.defineProperty(prototype, name, {
        get: installedGetter,
        set: installedSetter,
        enumerable: true,
        configurable: true,
      });
      
      return { get: installedGetter, set: installedSetter };
    },
    
    defineToStringTag(prototype, value) {
      Object.defineProperty(prototype, Symbol.toStringTag, {
        value,
        writable: false,
        enumerable: false,
        configurable: true,
      });
    },
    
    defineConstructorBacklink(prototype, constructor) {
      Object.defineProperty(prototype, 'constructor', {
        value: constructor,
        writable: true,
        enumerable: false,
        configurable: true,
      });
    },
    
    // ============================================================
    // 跨 Realm 方法支持
    // ============================================================
    
    createCrossRealmMethod(name, callback, displayName, registry) {
      let installedCallback;
      
      const invoke = (receiver, args) => {
        const foreignMethod = findCrossRealmPrototypeMethod(
          receiver,
          name,
          installedCallback,
          registry
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
      
      Object.defineProperty(installedCallback, 'name', {
        value: displayName,
        configurable: true,
      });
      
      Object.defineProperty(installedCallback, 'length', {
        value: callback.length,
        configurable: true,
      });
      
      const source = `function ${displayName}() { [native code] }`;
      registry.register(installedCallback, source);
      registry.registerImplementation(installedCallback, callback);
      
      return installedCallback;
    },
    
    createCrossRealmGetter(name, getter, registry) {
      let installedGetter;
      
      const invoke = receiver => {
        const foreignGetter = findCrossRealmPrototypeAccessor(
          receiver,
          name,
          'get',
          installedGetter,
          registry
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
      }, 'value').get;
      
      this.registerNativeGetter(installedGetter, name);
      registry.registerImplementation(installedGetter, getter);
      
      return installedGetter;
    },
    
    createCrossRealmSetter(name, setter, registry) {
      let installedSetter;
      
      const invoke = (receiver, value) => {
        const foreignSetter = findCrossRealmPrototypeAccessor(
          receiver,
          name,
          'set',
          installedSetter,
          registry
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
      }, 'value').set;
      
      this.registerNativeSetter(installedSetter, name);
      registry.registerImplementation(installedSetter, setter);
      
      return installedSetter;
    },
    
    // ============================================================
    // Web IDL 类型转换
    // ============================================================
    
    toDOMString(value) {
      if (typeof value === 'symbol') {
        throw new TypeError('Cannot convert a Symbol value to a string');
      }
      return `${value}`;
    },
    
    toBoolean(value) {
      return Boolean(value);
    },
    
    toEventListenerOptions(value) {
      if (value === undefined || value === null) {
        return {
          capture: false,
          once: false,
          passive: false,
          signal: null,
        };
      }
      
      if (typeof value === 'boolean') {
        return {
          capture: value,
          once: false,
          passive: false,
          signal: null,
        };
      }
      
      const source = Object(value);
      return {
        capture: Boolean(source.capture),
        once: Boolean(source.once),
        passive: Boolean(source.passive),
        signal: source.signal ?? null,
      };
    },
    
    toEventInit(value) {
      if (value === undefined || value === null) {
        return {
          bubbles: false,
          cancelable: false,
          composed: false,
        };
      }
      
      const source = Object(value);
      return {
        bubbles: Boolean(source.bubbles),
        cancelable: Boolean(source.cancelable),
        composed: Boolean(source.composed),
      };
    },
  };
}

/**
 * 查找跨 realm 的原型方法
 */
function findCrossRealmPrototypeMethod(receiver, name, localMethod, registry) {
  if (
    (typeof receiver !== 'object' && typeof receiver !== 'function')
    || receiver === null
  ) {
    return null;
  }
  
  let prototype = Object.getPrototypeOf(receiver);
  
  while (prototype !== null) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
    
    if (typeof descriptor?.value === 'function') {
      if (
        descriptor.value === localMethod
        || registry.isLocalImplementation(descriptor.value, localMethod)
      ) {
        return null;
      }
      
      return registry.has(descriptor.value) ? descriptor.value : null;
    }
    
    prototype = Object.getPrototypeOf(prototype);
  }
  
  return null;
}

/**
 * 查找跨 realm 的原型访问器
 */
function findCrossRealmPrototypeAccessor(receiver, name, kind, localAccessor, registry) {
  if (
    (typeof receiver !== 'object' && typeof receiver !== 'function')
    || receiver === null
  ) {
    return null;
  }
  
  let prototype = Object.getPrototypeOf(receiver);
  
  while (prototype !== null) {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
    
    if (descriptor !== undefined) {
      const accessor = descriptor[kind];
      
      if (
        typeof accessor !== 'function'
        || accessor === localAccessor
        || registry.isLocalImplementation(accessor, localAccessor)
      ) {
        return null;
      }
      
      return registry.has(accessor) ? accessor : null;
    }
    
    prototype = Object.getPrototypeOf(prototype);
  }
  
  return null;
}
