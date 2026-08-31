/**
 * Trace Logger
 * 
 * Collects trace events from plugins.
 */

export class TraceLogger {
  constructor() {
    this._events = [];
    this._enabled = true;
  }
  
  /**
   * Log a trace event
   */
  event(data) {
    if (!this._enabled) {
      return;
    }
    
    this._events.push({
      timestamp: Date.now(),
      ...data,
    });
  }
  
  /**
   * Get all events
   */
  getEvents() {
    return [...this._events];
  }
  
  /**
   * Get events for a specific plugin
   */
  getPluginEvents(pluginId) {
    return this._events.filter(e => e.pluginId === pluginId);
  }
  
  /**
   * Clear all events
   */
  clear() {
    this._events = [];
  }
  
  /**
   * Enable tracing
   */
  enable() {
    this._enabled = true;
  }
  
  /**
   * Disable tracing
   */
  disable() {
    this._enabled = false;
  }
  
  /**
   * Check if tracing is enabled
   */
  isEnabled() {
    return this._enabled;
  }
}
