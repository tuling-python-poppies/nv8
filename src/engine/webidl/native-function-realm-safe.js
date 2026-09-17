/**
 * Realm-safe native function registration
 *
 * Context factory and realm-object-keyed context storage. The production
 * install path (plugin and legacy bootstraps) uses the realm-local
 * `native-function.js` module instance, so each Realm owns its own
 * `nativeSources` / `nativeImplementations` / `currentContext`; contexts
 * obtained here are keyed by realm object (WeakMap) for external callers
 * that need a host-side handle to a Realm's registration functions.
 */

const nativeSources = new WeakMap();
const nativeImplementations = new WeakMap();
// 按 Realm 对象键控（WeakMap）：Realm 被 GC 后上下文随之释放，不需要
// 旧的「realmId 字符串 Map + 256 条上限淘汰」兜底（IKF39V(c)）。
const realmContexts = new WeakMap();

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
 * @param {object} realm - The Realm object (vm context / realm wrapper)
 * @returns {Object} The context for this realm
 */
export function getNativeFunctionContext(realm) {
  const isObject = realm !== null
    && (typeof realm === 'object' || typeof realm === 'function');
  if (!isObject) {
    throw new TypeError(
      `getNativeFunctionContext expects a realm object, got ${realm === null ? 'null' : typeof realm}`
    );
  }
  
  let context = realmContexts.get(realm);
  if (!context) {
    context = createNativeFunctionContext();
    realmContexts.set(realm, context);
  }
  return context;
}

// Legacy compatibility exports that throw helpful errors
export function registerNativeFunction() {
  throw new Error(
    'Direct registerNativeFunction() is deprecated. Use getNativeFunctionContext(realm).registerNativeFunction() instead.'
  );
}

export function configureNativeFunctionRegistry() {
  throw new Error(
    'Direct configureNativeFunctionRegistry() is deprecated. Use getNativeFunctionContext(realm).configureRegistry() instead.'
  );
}

export function installNativeFunctionToString() {
  throw new Error(
    'Direct installNativeFunctionToString() is deprecated. Use getNativeFunctionContext(realm).installToString(Function.prototype) instead.'
  );
}
