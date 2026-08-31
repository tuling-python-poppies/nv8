/**
 * Plugin Context Implementation
 * 
 * Provides sandboxed access to capabilities and services for plugins.
 */

import { createDiagnosticError, ErrorCode } from '../diagnostics/errors.js';

export class PluginContextImpl {
  constructor(config) {
    this._pluginId = config.pluginId;
    this._appInfo = config.appInfo;
    this._realmInfo = config.realmInfo;
    this._capabilities = config.capabilities;
    this._surfaceRegistry = config.surfaceRegistry;
    this._stateRegistry = config.stateRegistry;
    this._lifecycleManager = config.lifecycleManager;
    this._scheduler = config.scheduler;
    this._trace = config.trace;
    this._diagnostics = config.diagnostics;
    
    // Create context object
    this.context = this._createContext();
  }
  
  _createContext() {
    const self = this;
    
    return {
      // Identity
      pluginId: this._pluginId,
      
      // App information
      app: {
        id: this._appInfo.id,
        profile: this._appInfo.profile,
        backend: this._appInfo.backend,
      },
      
      // Realm information
      realm: {
        id: this._realmInfo.id,
        type: this._realmInfo.type,
        global: this._realmInfo.global,
        document: this._realmInfo.document,
        origin: this._realmInfo.origin,
      },
      
      // Capability system
      capability: {
        has: (capabilityId) => self._capabilities.has(capabilityId),
        require: (capabilityId) => self._capabilities.require(capabilityId),
        describe: (capabilityId) => self._capabilities.describe(capabilityId),
      },
      
      // Surface system
      surface: {
        attach: (target, property, value) => {
          self._surfaceRegistry.attach(self._pluginId, target, property, value);
        },
        detach: (target, property) => {
          self._surfaceRegistry.detach(self._pluginId, target, property);
        },
        get: (target, property) => {
          return self._surfaceRegistry.get(target, property);
        },
      },
      
      // State system
      state: {
        get: (namespace, key) => {
          return self._stateRegistry.get(self._pluginId, namespace, key);
        },
        set: (namespace, key, value) => {
          self._stateRegistry.set(self._pluginId, namespace, key, value);
        },
        delete: (namespace, key) => {
          self._stateRegistry.delete(self._pluginId, namespace, key);
        },
        has: (namespace, key) => {
          return self._stateRegistry.has(self._pluginId, namespace, key);
        },
        clear: (namespace) => {
          self._stateRegistry.clear(self._pluginId, namespace);
        },
      },
      
      // Lifecycle system
      lifecycle: {
        onReset: (handler) => {
          self._lifecycleManager.registerResetHandler(self._pluginId, handler);
        },
        onDispose: (handler) => {
          self._lifecycleManager.registerDisposeHandler(self._pluginId, handler);
        },
      },
      
      // Scheduler
      scheduler: {
        setTimeout: (handler, delay) => {
          return self._scheduler.setTimeout(handler, delay);
        },
        clearTimeout: (id) => {
          self._scheduler.clearTimeout(id);
        },
        setInterval: (handler, delay) => {
          return self._scheduler.setInterval(handler, delay);
        },
        clearInterval: (id) => {
          self._scheduler.clearInterval(id);
        },
        queueMicrotask: (task) => {
          self._scheduler.queueMicrotask(task);
        },
      },
      
      // Diagnostics
      trace: {
        event: (data) => {
          self._trace.event({
            ...data,
            pluginId: self._pluginId,
          });
        },
      },
      
      warn: (message, context) => {
        self._diagnostics.warn({
          pluginId: self._pluginId,
          message,
          context,
        });
      },
      
      error: (message, context) => {
        self._diagnostics.error({
          pluginId: self._pluginId,
          message,
          context,
        });
      },
    };
  }
}
