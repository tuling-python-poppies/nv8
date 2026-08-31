/**
 * Plugin Lifecycle Manager
 * 
 * Manages plugin lifecycle handlers (reset, dispose).
 */

export class PluginLifecycleManager {
  constructor() {
    // Map: pluginId -> { resetHandlers: [], disposeHandlers: [] }
    this._handlers = new Map();
  }
  
  /**
   * Register a plugin
   */
  registerPlugin(pluginId) {
    if (!this._handlers.has(pluginId)) {
      this._handlers.set(pluginId, {
        resetHandlers: [],
        disposeHandlers: [],
      });
    }
  }
  
  /**
   * Register a reset handler
   */
  registerResetHandler(pluginId, handler) {
    const entry = this._handlers.get(pluginId);
    if (entry) {
      entry.resetHandlers.push(handler);
    }
  }
  
  /**
   * Register a dispose handler
   */
  registerDisposeHandler(pluginId, handler) {
    const entry = this._handlers.get(pluginId);
    if (entry) {
      entry.disposeHandlers.push(handler);
    }
  }
  
  /**
   * Execute reset handlers for plugins
   */
  async executeReset(pluginIds) {
    for (const pluginId of pluginIds) {
      const entry = this._handlers.get(pluginId);
      if (entry && entry.resetHandlers.length > 0) {
        for (const handler of entry.resetHandlers) {
          await handler();
        }
      }
    }
  }
  
  /**
   * Execute dispose handlers for plugins (in reverse order)
   */
  async executeDispose(pluginIds) {
    // Execute in reverse order
    for (let i = pluginIds.length - 1; i >= 0; i--) {
      const pluginId = pluginIds[i];
      const entry = this._handlers.get(pluginId);
      if (entry && entry.disposeHandlers.length > 0) {
        for (const handler of entry.disposeHandlers) {
          try {
            await handler();
          } catch (error) {
            console.error(`Dispose handler error for ${pluginId}:`, error);
          }
        }
      }
    }
  }
  
  /**
   * Clear handlers for a plugin
   */
  clearPlugin(pluginId) {
    this._handlers.delete(pluginId);
  }
  
  /**
   * Clear all handlers
   */
  clearAll() {
    this._handlers.clear();
  }
}
