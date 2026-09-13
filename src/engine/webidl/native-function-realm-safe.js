/**
 * Realm-safe native function registration
 * 
 * This module provides Realm-scoped native function tracking without
 * module-level mutable state. Each Realm receives its own registry
 * and Function.prototype.toString installation.
 */

const nativeSources = new WeakMap();
const nativeImplementations = new WeakMap();
const realmContexts = new Map(); // Use Map instead of WeakMap for realm IDs

// 上限与淘汰：正常路径由 webidl 插件 dispose 调 removeNativeFunctionContext
// 清理；但 dispose 失败/漏调时这个 Map 会按 realm 数无限增长（IKF39V(c)）。
// 达到上限时淘汰最旧条目，保证内存有界。
const MAX_REALM_CONTEXTS = 256;

/**
 * Create a Realm-local native function context
 * @returns {Object} Context with registration functions
 */
export function createNativeFunctionContext() {
  const registeredFunctions = new Set();
  let registryRef = null;
  let toStringInstalled = false;
  
  const context = {
    /**
     * Register a function as native with a display name
     */
    registerNativeFunction(callback, displayName) {
      const source = `function ${displayName}() { [native code] }`;
      nativeSources.set(callback, source);
      registeredFunctions.add(callback);
      registryRef?.register(callback, source);
      return callback;
    },
    
    /**
     * Register a getter function with property name
     */
    registerNativeGetter(callback, propertyName) {
      Object.defineProperty(callback, "name", {
        value: `get ${propertyName}`,
        configurable: true,
      });
      const source = `function get ${propertyName}() { [native code] }`;
      nativeSources.set(callback, source);
      registeredFunctions.add(callback);
      registryRef?.register(callback, source);
      return callback;
    },
    
    /**
     * Create a native function with implementation
     */
    createNativeFunction(name, length, implementation, displayName = name) {
      const invoke = (receiver, args) =>
        Reflect.apply(implementation, receiver, args);
      const callback = {
        call(...args) {
          return invoke(this, args);
        },
      }.call;
      Object.defineProperty(callback, "name", {
        value: name,
        configurable: true,
      });
      Object.defineProperty(callback, "length", {
        value: length,
        configurable: true,
      });
      context.registerNativeFunction(callback, displayName);
      context.registerNativeFunctionImplementation(callback, implementation);
      return callback;
    },
    
    /**
     * Configure the cross-realm registry for this context
     */
    configureRegistry(registry) {
      registryRef = registry;
      if (registryRef === null) return;
      for (const callback of registeredFunctions) {
        registryRef.register(callback, nativeSources.get(callback));
      }
    },
    
    /**
     * Check if a function is registered as native
     */
    isRegisteredNativeFunction(callback) {
      return nativeSources.has(callback)
        || Boolean(registryRef?.has(callback));
    },
    
    /**
     * Register implementation mapping
     */
    registerNativeFunctionImplementation(installedCallback, implementation) {
      nativeImplementations.set(installedCallback, implementation);
    },
    
    /**
     * Check if implementation matches
     */
    isLocalNativeFunctionImplementation(installedCallback, implementation) {
      return nativeImplementations.get(installedCallback) === implementation;
    },
    
    /**
     * Install toString override on Function.prototype
     * This modifies the Realm's Function.prototype
     */
    installToString(functionPrototype) {
      if (toStringInstalled) {
        return;
      }
      
      const originalToString = functionPrototype.toString;
      
      const invoke = receiver => {
        const source = nativeSources.get(receiver)
          ?? registryRef?.source(receiver);
        if (source !== undefined) {
          return source;
        }
        return Reflect.apply(originalToString, receiver, []);
      };
      
      const toString = {
        call() {
          return invoke(this);
        },
      }.call;
      
      Object.defineProperty(toString, "name", {
        value: "toString",
        configurable: true,
      });
      
      context.registerNativeFunction(toString, "toString");
      
      Object.defineProperty(functionPrototype, "toString", {
        value: toString,
        writable: true,
        enumerable: false,
        configurable: true,
      });
      
      toStringInstalled = true;
    },
    
    /**
     * Check if toString is installed in this context
     */
    isToStringInstalled() {
      return toStringInstalled;
    },
  };
  
  return context;
}

/**
 * Get or create a native function context for a Realm
 * @param {string} realmId - The realm identifier
 * @returns {Object} The context for this realm
 */
export function getNativeFunctionContext(realmId) {
  if (typeof realmId !== 'string') {
    throw new TypeError(
      `getNativeFunctionContext expects a realm ID string, got ${typeof realmId}`
    );
  }
  
  let context = realmContexts.get(realmId);
  if (!context) {
    context = createNativeFunctionContext();
    realmContexts.set(realmId, context);
    if (realmContexts.size > MAX_REALM_CONTEXTS) {
      const oldest = realmContexts.keys().next().value;
      realmContexts.delete(oldest);
    }
  }
  return context;
}

/**
 * Remove a Realm's native function context
 * @param {string} realmId - The realm identifier
 */
export function removeNativeFunctionContext(realmId) {
  realmContexts.delete(realmId);
}

// Legacy compatibility exports that throw helpful errors
export function registerNativeFunction() {
  throw new Error(
    'Direct registerNativeFunction() is deprecated. Use getNativeFunctionContext(realmId).registerNativeFunction() instead.'
  );
}

export function configureNativeFunctionRegistry() {
  throw new Error(
    'Direct configureNativeFunctionRegistry() is deprecated. Use getNativeFunctionContext(realmId).configureRegistry() instead.'
  );
}

export function installNativeFunctionToString() {
  throw new Error(
    'Direct installNativeFunctionToString() is deprecated. Use getNativeFunctionContext(realmId).installToString(Function.prototype) instead.'
  );
}
