/**
 * Controlled Scheduler
 * 
 * Provides sandboxed timer and microtask scheduling.
 */

export class ControlledScheduler {
  constructor() {
    this._timers = new Map();
    this._nextId = 1;
    this._disposed = false;
  }
  
  /**
   * Schedule a timeout
   */
  setTimeout(handler, delay) {
    if (this._disposed) {
      throw new Error('Scheduler is disposed');
    }
    
    const id = this._nextId++;
    
    const timerId = setTimeout(() => {
      this._timers.delete(id);
      handler();
    }, delay);
    
    this._timers.set(id, { type: 'timeout', timerId });
    
    return id;
  }
  
  /**
   * Clear a timeout
   */
  clearTimeout(id) {
    const entry = this._timers.get(id);
    
    if (entry && entry.type === 'timeout') {
      clearTimeout(entry.timerId);
      this._timers.delete(id);
    }
  }
  
  /**
   * Schedule an interval
   */
  setInterval(handler, delay) {
    if (this._disposed) {
      throw new Error('Scheduler is disposed');
    }
    
    const id = this._nextId++;
    
    const timerId = setInterval(handler, delay);
    
    this._timers.set(id, { type: 'interval', timerId });
    
    return id;
  }
  
  /**
   * Clear an interval
   */
  clearInterval(id) {
    const entry = this._timers.get(id);
    
    if (entry && entry.type === 'interval') {
      clearInterval(entry.timerId);
      this._timers.delete(id);
    }
  }
  
  /**
   * Queue a microtask
   */
  queueMicrotask(task) {
    if (this._disposed) {
      throw new Error('Scheduler is disposed');
    }
    
    queueMicrotask(task);
  }
  
  /**
   * Get active timer count
   */
  getActiveTimerCount() {
    return this._timers.size;
  }
  
  /**
   * Clear all timers
   */
  clearAll() {
    for (const [id, entry] of this._timers) {
      if (entry.type === 'timeout') {
        clearTimeout(entry.timerId);
      } else if (entry.type === 'interval') {
        clearInterval(entry.timerId);
      }
    }
    
    this._timers.clear();
  }
  
  /**
   * Dispose scheduler
   */
  dispose() {
    this.clearAll();
    this._disposed = true;
  }
}
