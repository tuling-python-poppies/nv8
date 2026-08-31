/**
 * State Registry
 * 
 * Manages plugin state namespaces.
 */

import { createDiagnosticError, ErrorCode } from '../diagnostics/errors.js';

export class StateRegistry {
  constructor() {
    // Map: "pluginId:namespace" -> Map<key, value>
    this._namespaces = new Map();
    // Track ownership: Map: namespace -> pluginId
    this._ownership = new Map();
  }
  
  /**
   * Register a namespace for a plugin
   */
  registerNamespace(pluginId, namespace) {
    const key = `${pluginId}:${namespace}`;
    
    // Allow re-registration (idempotent)
    if (this._namespaces.has(key)) {
      return;
    }
    
    this._namespaces.set(key, new Map());
    this._ownership.set(namespace, pluginId);
  }
  
  /**
   * Get a value from a namespace
   */
  get(pluginId, namespace, key) {
    const nsKey = `${pluginId}:${namespace}`;
    const store = this._namespaces.get(nsKey);
    
    if (!store) {
      // Return undefined instead of throwing for missing namespace
      // This allows plugins to check state before namespace is registered
      return undefined;
    }
    
    return store.get(key);
  }
  
  /**
   * Set a value in a namespace
   */
  set(pluginId, namespace, key, value) {
    const nsKey = `${pluginId}:${namespace}`;
    const store = this._namespaces.get(nsKey);
    
    if (!store) {
      throw createDiagnosticError(
        ErrorCode.STATE_NAMESPACE_NOT_FOUND,
        `State namespace '${namespace}' not found for plugin '${pluginId}'`,
        {
          phase: 'runtime',
          context: { pluginId, namespace },
        }
      );
    }
    
    store.set(key, value);
  }
  
  /**
   * Delete a value from a namespace
   */
  delete(pluginId, namespace, key) {
    const nsKey = `${pluginId}:${namespace}`;
    const store = this._namespaces.get(nsKey);
    
    if (!store) {
      return false;
    }
    
    return store.delete(key);
  }
  
  /**
   * Check if a key exists in a namespace
   */
  has(pluginId, namespace, key) {
    const nsKey = `${pluginId}:${namespace}`;
    const store = this._namespaces.get(nsKey);
    
    if (!store) {
      return false;
    }
    
    return store.has(key);
  }
  
  /**
   * Clear a namespace
   */
  clear(pluginId, namespace) {
    const nsKey = `${pluginId}:${namespace}`;
    const store = this._namespaces.get(nsKey);
    
    if (store) {
      store.clear();
    }
  }
  
  /**
   * Get all keys in a namespace
   */
  keys(pluginId, namespace) {
    const nsKey = `${pluginId}:${namespace}`;
    const store = this._namespaces.get(nsKey);
    
    if (!store) {
      return [];
    }
    
    return Array.from(store.keys());
  }
  
  /**
   * Get namespace snapshot
   */
  snapshot(pluginId, namespace) {
    const nsKey = `${pluginId}:${namespace}`;
    const store = this._namespaces.get(nsKey);
    
    if (!store) {
      return {};
    }
    
    const snapshot = {};
    for (const [key, value] of store) {
      snapshot[key] = value;
    }
    
    return snapshot;
  }
  
  /**
   * Restore namespace from snapshot
   */
  restore(pluginId, namespace, snapshot) {
    const nsKey = `${pluginId}:${namespace}`;
    const store = this._namespaces.get(nsKey);
    
    if (!store) {
      throw createDiagnosticError(
        ErrorCode.STATE_NAMESPACE_NOT_FOUND,
        `State namespace '${namespace}' not found for plugin '${pluginId}'`,
        {
          phase: 'restore',
          context: { pluginId, namespace },
        }
      );
    }
    
    store.clear();
    
    for (const [key, value] of Object.entries(snapshot)) {
      store.set(key, value);
    }
  }
  
  /**
   * Clear all namespaces for a plugin
   */
  clearPlugin(pluginId) {
    // Clear state values but keep namespace registrations
    for (const [key, store] of this._namespaces) {
      if (key.startsWith(`${pluginId}:`)) {
        store.clear();
      }
    }
  }
  
  /**
   * Get all namespaces
   */
  getAllNamespaces() {
    const result = [];
    
    for (const [key] of this._namespaces) {
      const [pluginId, namespace] = key.split(':');
      result.push({ pluginId, name: namespace });
    }
    
    return result;
  }
}
