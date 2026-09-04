/**
 * Legacy compatibility layer for native function registration
 * 
 * This module maintains backward compatibility with existing code
 * while delegating to the new Realm-safe implementation.
 * 
 * DEPRECATED: New code should use native-function-realm-safe.js directly.
 */

import {
  createNativeFunctionContext,
  getNativeFunctionContext,
} from './native-function-realm-safe.js';

// Thread-local context storage for legacy compatibility
let currentContext = null;

// Pending registrations that occurred before context was set
const pendingRegistrations = [];

/**
 * Set the active context for legacy API calls
 * This should be called at the start of each Realm activation
 */
export function setNativeFunctionContext(context) {
  currentContext = context;
  
  // Process any pending registrations
  if (context && pendingRegistrations.length > 0) {
    for (const registration of pendingRegistrations) {
      registration.execute(context);
    }
    pendingRegistrations.length = 0;
  }
}

/**
 * Get the current context, or null if not set
 * For module-level calls, we queue the registration for later
 */
function getContext() {
  return currentContext;
}

/**
 * Queue a registration to be executed when context is set
 */
function queueRegistration(execute) {
  if (currentContext) {
    execute(currentContext);
  } else {
    pendingRegistrations.push({ execute });
  }
}

/**
 * Legacy: Register a function as native with a display name
 * @deprecated Use getNativeFunctionContext(realm).registerNativeFunction() instead
 */
export function registerNativeFunction(callback, displayName) {
  const ctx = getContext();
  if (ctx) {
    return ctx.registerNativeFunction(callback, displayName);
  }
  // Queue for later execution when context is set
  queueRegistration(ctx => ctx.registerNativeFunction(callback, displayName));
  return callback;
}

/**
 * Legacy: Register a getter function with property name
 * @deprecated Use getNativeFunctionContext(realm).registerNativeGetter() instead
 */
export function registerNativeGetter(callback, propertyName) {
  const ctx = getContext();
  if (ctx) {
    return ctx.registerNativeGetter(callback, propertyName);
  }
  queueRegistration(ctx => ctx.registerNativeGetter(callback, propertyName));
  return callback;
}

/**
 * Legacy: Create a native function with implementation
 * @deprecated Use getNativeFunctionContext(realm).createNativeFunction() instead
 */
export function createNativeFunction(
  name,
  length,
  implementation,
  displayName = name,
) {
  const ctx = getContext();
  if (ctx) {
    return ctx.createNativeFunction(name, length, implementation, displayName);
  }
  // For module-level createNativeFunction, we need to create the function immediately
  // but defer the registration. This is more complex.
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
  
  // Queue the registration
  queueRegistration(ctx => {
    ctx.registerNativeFunction(callback, displayName);
    ctx.registerNativeFunctionImplementation(callback, implementation);
  });
  
  return callback;
}

/**
 * Legacy: Configure the cross-realm registry
 * @deprecated Use getNativeFunctionContext(realm).configureRegistry() instead
 */
export function configureNativeFunctionRegistry(registry) {
  // For legacy bootstrap paths that call this before context is set,
  // we defer the configuration until a context is available
  if (!currentContext) {
    // Queue for when the context is created during Realm activation
    queueRegistration(ctx => ctx.configureRegistry(registry));
    return;
  }
  currentContext.configureRegistry(registry);
}

/**
 * Legacy: Check if a function is registered as native
 * @deprecated Use getNativeFunctionContext(realm).isRegisteredNativeFunction() instead
 */
export function isRegisteredNativeFunction(callback) {
  const ctx = getContext();
  if (ctx) {
    return ctx.isRegisteredNativeFunction(callback);
  }
  return false;
}

/**
 * Legacy: Register implementation mapping
 * @deprecated Use getNativeFunctionContext(realm).registerNativeFunctionImplementation() instead
 */
export function registerNativeFunctionImplementation(
  installedCallback,
  implementation,
) {
  const ctx = getContext();
  if (ctx) {
    return ctx.registerNativeFunctionImplementation(
      installedCallback,
      implementation
    );
  }
  queueRegistration(ctx =>
    ctx.registerNativeFunctionImplementation(installedCallback, implementation)
  );
}

/**
 * Legacy: Check if implementation matches
 * @deprecated Use getNativeFunctionContext(realm).isLocalNativeFunctionImplementation() instead
 */
export function isLocalNativeFunctionImplementation(
  installedCallback,
  implementation,
) {
  const ctx = getContext();
  if (ctx) {
    return ctx.isLocalNativeFunctionImplementation(
      installedCallback,
      implementation
    );
  }
  return false;
}


/**
 * 建立本 Realm 的原生函数上下文并冲刷排队中的注册。
 *
 * legacy bootstrap 必须在任何 install 之前调用它。此前只有 webidl 插件会
 * 调 `setNativeFunctionContext`，导致 legacy 模式下 `registerNativeFunction`
 * 全部滞留在队列中、`Function.prototype.toString` 从未被接管——也就没有任何
 * 原生函数伪装。
 *
 * 幂等：已有上下文时不重建，避免丢掉已注册的来源映射。
 *
 * @returns {object} 当前上下文
 */
export function establishNativeFunctionContext() {
  if (currentContext !== null) return currentContext;
  const context = createNativeFunctionContext();
  setNativeFunctionContext(context);
  return context;
}

/**
 * Legacy: Install toString override on Function.prototype
 * @deprecated Use getNativeFunctionContext(realm).installToString() instead
 */
export function installNativeFunctionToString() {
  const ctx = getContext();
  if (ctx) {
    ctx.installToString(Function.prototype);
  } else {
    queueRegistration(ctx => ctx.installToString(Function.prototype));
  }
}

// Re-export the new API for migration
export { getNativeFunctionContext, createNativeFunctionContext };
